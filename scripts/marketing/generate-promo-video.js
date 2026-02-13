#!/usr/bin/env node
/**
 * Promo Video Generator for Rivulet
 *
 * Uses ffmpeg to combine screenshots + screen recordings into
 * short promotional videos for TikTok/Instagram Reels.
 *
 * Prerequisites:
 * - ffmpeg installed (https://ffmpeg.org/download.html)
 * - Screen recordings placed in assets/recordings/
 *
 * Usage:
 *   node generate-promo-video.js
 *
 * Input files expected:
 *   assets/recordings/tap-fill.mp4      — Screen recording of tapping to fill water
 *   assets/recordings/celebration.mp4   — Screen recording of goal celebration
 *   assets/recordings/swipe.mp4         — Screen recording of swiping to history
 *   assets/recordings/widget.mp4        — Screen recording of using widget
 *
 * Output:
 *   assets/promo/rivulet-reel-vertical.mp4  (1080x1920, 15-30s)
 *   assets/promo/rivulet-reel-square.mp4    (1080x1080, 15-30s)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..', '..');
const RECORDINGS_DIR = path.join(ROOT, 'assets', 'recordings');
const PROMO_DIR = path.join(ROOT, 'assets', 'promo');

function run(cmd) {
  console.log(`  $ ${cmd.substring(0, 100)}...`);
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
}

function main() {
  // Verify ffmpeg
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
  } catch {
    console.error('ffmpeg not found. Install it: https://ffmpeg.org/download.html');
    console.error('On Windows: winget install ffmpeg');
    process.exit(1);
  }

  // Check for recordings
  if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
    console.log(`Created ${RECORDINGS_DIR}`);
    console.log('\nPlace your screen recordings in this folder:');
    console.log('  tap-fill.mp4      — Tapping to fill water');
    console.log('  celebration.mp4   — Goal celebration effect');
    console.log('  swipe.mp4         — Swiping to history screen');
    console.log('  widget.mp4        — Using the home screen widget');
    console.log('\nThen run this script again.');
    process.exit(0);
  }

  const recordings = fs.readdirSync(RECORDINGS_DIR).filter((f) => f.endsWith('.mp4'));
  if (recordings.length === 0) {
    console.log('No .mp4 recordings found in assets/recordings/');
    console.log('Record your screen and place files there.');
    process.exit(0);
  }

  fs.mkdirSync(PROMO_DIR, { recursive: true });

  console.log(`Found ${recordings.length} recordings. Creating promo videos...\n`);

  // Create a concat file for ffmpeg
  const concatFile = path.join(PROMO_DIR, 'concat.txt');
  const concatContent = recordings
    .map((f) => `file '${path.join(RECORDINGS_DIR, f).replace(/\\/g, '/')}'`)
    .join('\n');
  fs.writeFileSync(concatFile, concatContent);

  // Vertical reel (1080x1920) — for TikTok, Instagram Reels, YouTube Shorts
  const verticalOutput = path.join(PROMO_DIR, 'rivulet-reel-vertical.mp4');
  console.log('Creating vertical reel (1080x1920)...');
  try {
    run(
      `ffmpeg -y -f concat -safe 0 -i "${concatFile}" ` +
      `-vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,` +
      `fade=t=in:st=0:d=0.5,fade=t=out:st=14.5:d=0.5" ` +
      `-t 15 -c:v libx264 -preset medium -crf 23 -an "${verticalOutput}"`
    );
    console.log(`  Saved: ${verticalOutput}\n`);
  } catch (err) {
    console.error(`  Failed: ${err.message}\n`);
  }

  // Square reel (1080x1080) — for Instagram posts, Twitter
  const squareOutput = path.join(PROMO_DIR, 'rivulet-reel-square.mp4');
  console.log('Creating square reel (1080x1080)...');
  try {
    run(
      `ffmpeg -y -f concat -safe 0 -i "${concatFile}" ` +
      `-vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black,` +
      `fade=t=in:st=0:d=0.5,fade=t=out:st=14.5:d=0.5" ` +
      `-t 15 -c:v libx264 -preset medium -crf 23 -an "${squareOutput}"`
    );
    console.log(`  Saved: ${squareOutput}\n`);
  } catch (err) {
    console.error(`  Failed: ${err.message}\n`);
  }

  // Cleanup
  fs.unlinkSync(concatFile);

  console.log('========================================');
  console.log(' Promo videos generated!');
  console.log('========================================');
  console.log(`\nVertical: ${verticalOutput}`);
  console.log(`Square: ${squareOutput}`);
  console.log('\nUpload these to TikTok, Instagram Reels, and YouTube Shorts.');
}

main();
