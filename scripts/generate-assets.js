/**
 * Drip App - Asset Generator using ComfyUI API
 *
 * Generates: app icon, splash screen, adaptive icon, widget preview, feature graphic
 * Uses SDXL Base 1.0 with CLIPTextEncodeSDXL workflow
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const COMFYUI_URL = 'http://localhost:8188';
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const STORE_DIR = path.join(ASSETS_DIR, 'store');

fs.mkdirSync(STORE_DIR, { recursive: true });

function httpRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const data = Buffer.concat(chunks);
        if (res.headers['content-type']?.includes('application/json')) {
          resolve({ status: res.statusCode, data: JSON.parse(data.toString()) });
        } else {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function buildWorkflow(prompt, negativePrompt, width, height, seed = null) {
  const actualSeed = seed ?? Math.floor(Math.random() * 1000000000);

  return {
    prompt: {
      // Load SDXL checkpoint
      "1": {
        class_type: "CheckpointLoaderSimple",
        inputs: {
          ckpt_name: "sd_xl_base_1.0.safetensors"
        }
      },
      // Positive prompt (SDXL style)
      "2": {
        class_type: "CLIPTextEncodeSDXL",
        inputs: {
          clip: ["1", 1],
          text_g: prompt,
          text_l: prompt,
          width: width,
          height: height,
          crop_w: 0,
          crop_h: 0,
          target_width: width,
          target_height: height
        }
      },
      // Negative prompt
      "3": {
        class_type: "CLIPTextEncodeSDXL",
        inputs: {
          clip: ["1", 1],
          text_g: negativePrompt,
          text_l: negativePrompt,
          width: width,
          height: height,
          crop_w: 0,
          crop_h: 0,
          target_width: width,
          target_height: height
        }
      },
      // Empty latent image
      "4": {
        class_type: "EmptyLatentImage",
        inputs: {
          width: width,
          height: height,
          batch_size: 1
        }
      },
      // KSampler
      "5": {
        class_type: "KSampler",
        inputs: {
          model: ["1", 0],
          positive: ["2", 0],
          negative: ["3", 0],
          latent_image: ["4", 0],
          seed: actualSeed,
          steps: 30,
          cfg: 7.0,
          sampler_name: "euler_ancestral",
          scheduler: "karras",
          denoise: 1.0
        }
      },
      // VAE Decode
      "6": {
        class_type: "VAEDecode",
        inputs: {
          samples: ["5", 0],
          vae: ["1", 2]
        }
      },
      // Save Image
      "7": {
        class_type: "SaveImage",
        inputs: {
          images: ["6", 0],
          filename_prefix: "drip_asset"
        }
      }
    }
  };
}

async function queuePrompt(workflow) {
  const clientId = crypto.randomUUID();
  const body = JSON.stringify({
    prompt: workflow.prompt,
    client_id: clientId
  });

  const res = await httpRequest(`${COMFYUI_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, body);

  if (res.data.error) {
    console.error('Queue error:', JSON.stringify(res.data.error));
    throw new Error('Failed to queue prompt');
  }

  return { promptId: res.data.prompt_id, clientId };
}

async function waitForCompletion(promptId) {
  let attempts = 0;
  while (attempts < 300) { // max 10 minutes
    const res = await httpRequest(`${COMFYUI_URL}/history/${promptId}`);
    const history = res.data;

    if (history[promptId]) {
      const status = history[promptId].status;
      if (status?.status_str === 'error') {
        const errorMsg = status.messages?.find(m => m[0] === 'execution_error');
        console.error('  Execution error:', errorMsg?.[1]?.exception_message || 'Unknown error');
        throw new Error('Execution failed');
      }

      const outputs = history[promptId].outputs;
      for (const nodeId of Object.keys(outputs)) {
        if (outputs[nodeId].images) {
          return outputs[nodeId].images[0];
        }
      }

      if (status?.status_str === 'success') {
        throw new Error('No image output found in successful execution');
      }
    }

    await new Promise(r => setTimeout(r, 2000));
    attempts++;
  }
  throw new Error('Timed out waiting for generation');
}

async function downloadImage(imageInfo, outputPath) {
  const url = `${COMFYUI_URL}/view?filename=${encodeURIComponent(imageInfo.filename)}&subfolder=${encodeURIComponent(imageInfo.subfolder || '')}&type=${imageInfo.type}`;
  const res = await httpRequest(url);
  fs.writeFileSync(outputPath, res.data);
  const sizeKB = Math.round(res.data.length / 1024);
  console.log(`  Saved: ${outputPath} (${sizeKB} KB)`);
}

const DEFAULT_NEGATIVE = 'text, words, letters, watermark, logo, blurry, ugly, distorted, low quality, noisy, grainy, realistic photo, photograph, 3d render';

async function generateAsset(name, prompt, width, height, outputPath, seed = null) {
  console.log(`\nGenerating: ${name} (${width}x${height})`);
  console.log(`  Prompt: ${prompt.substring(0, 100)}...`);

  const workflow = buildWorkflow(prompt, DEFAULT_NEGATIVE, width, height, seed);
  const { promptId } = await queuePrompt(workflow);
  console.log(`  Queued: ${promptId}`);

  const imageInfo = await waitForCompletion(promptId);
  console.log(`  Generated: ${imageInfo.filename}`);

  await downloadImage(imageInfo, outputPath);
}

async function main() {
  console.log('=== Drip App Asset Generator ===');
  console.log('Using SDXL Base 1.0 with CLIPTextEncodeSDXL\n');

  // 1. App Icon
  await generateAsset(
    'App Icon',
    'A single perfect water droplet, minimalist flat design, deep sapphire blue gradient from dark navy at bottom to bright cerulean cyan at top, pure white background, centered composition, clean sharp edges, no shadows, no text, app icon style, geometric precision, ultra clean, vector art quality, simple elegant',
    1024, 1024,
    path.join(ASSETS_DIR, 'icon.png'),
    42
  );

  // 2. Adaptive Icon Foreground
  await generateAsset(
    'Adaptive Icon',
    'A single perfect water droplet, minimalist flat design, deep sapphire blue gradient from dark navy at bottom to bright cerulean cyan at top, white background with generous padding around the droplet, centered composition, clean sharp edges, no shadows, no text, app icon style, geometric precision, ultra clean, vector art quality',
    1024, 1024,
    path.join(ASSETS_DIR, 'adaptive-icon.png'),
    43
  );

  // 3. Splash Screen
  await generateAsset(
    'Splash Screen',
    'Minimalist abstract composition, the bottom half is calm deep sapphire blue water with subtle gentle wave at the waterline, the top half is pure clean white empty space, serene tranquil mood, no text, no objects, luxury premium feel, high quality clean design',
    1024, 1024,
    path.join(ASSETS_DIR, 'splash-icon.png'),
    123
  );

  // 4. Widget Preview
  await generateAsset(
    'Widget Preview',
    'UI widget mockup, dark navy blue rounded rectangle card, large cyan number 5 in center with bold modern font, small gray text below, thin horizontal progress bar at 62 percent, minimal clean flat design, dark mode UI element, app widget style',
    512, 256,
    path.join(ASSETS_DIR, 'widget-preview.png'),
    456
  );

  // 5. Feature Graphic
  await generateAsset(
    'Feature Graphic',
    'Wide banner, deep sapphire blue gradient background fading from dark navy to medium blue, abstract minimal water waves at the bottom edge in bright cerulean cyan, clean luxurious premium feel, subtle water ripple effects, no text, no phone mockups, elegant minimalist marketing banner',
    1024, 500,
    path.join(STORE_DIR, 'feature-graphic.png'),
    789
  );

  // 6-10. Store Screenshot Backgrounds
  const screenshots = [
    {
      name: 'Screenshot BG 1 - Light Water',
      prompt: 'Soft white to light blue gradient background, subtle abstract water texture at the bottom portion in sapphire blue, clean minimalist, premium luxury feel, portrait composition, no text, no objects, app store screenshot background',
    },
    {
      name: 'Screenshot BG 2 - Dark Mode',
      prompt: 'Pure black OLED background, subtle teal blue water glow at the bottom half fading upward, dark luxury premium feel, minimal, portrait composition, no text, no objects, app store screenshot background',
    },
    {
      name: 'Screenshot BG 3 - Clean White',
      prompt: 'Clean white background with very subtle light blue gradient at the edges, minimal geometric feel, data visualization aesthetic, portrait composition, no text, no objects, app store screenshot background',
    },
    {
      name: 'Screenshot BG 4 - Aesthetic Home',
      prompt: 'Soft pastel gradient background, light pink to light blue, dreamy aesthetic phone wallpaper feel, light and airy, portrait composition, no text, no objects, home screen aesthetic background',
    },
    {
      name: 'Screenshot BG 5 - Zen',
      prompt: 'Clean minimal white background with very subtle water droplet shape watermark in center, light cerulean blue tint, zen peaceful calm, premium luxury feel, portrait composition, no text',
    },
  ];

  for (let i = 0; i < screenshots.length; i++) {
    await generateAsset(
      screenshots[i].name,
      screenshots[i].prompt,
      1024, 1024,
      path.join(STORE_DIR, `screenshot-bg-${i + 1}.png`),
      1000 + i
    );
  }

  console.log('\n=== All 10 assets generated! ===');
  console.log(`\nAssets:`);
  console.log(`  ${ASSETS_DIR}/icon.png`);
  console.log(`  ${ASSETS_DIR}/adaptive-icon.png`);
  console.log(`  ${ASSETS_DIR}/splash-icon.png`);
  console.log(`  ${ASSETS_DIR}/widget-preview.png`);
  console.log(`  ${STORE_DIR}/feature-graphic.png`);
  console.log(`  ${STORE_DIR}/screenshot-bg-{1..5}.png`);
}

main().catch(console.error);
