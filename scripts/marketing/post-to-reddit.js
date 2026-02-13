#!/usr/bin/env node
/**
 * Reddit Auto-Poster for Rivulet Marketing
 *
 * Posts pre-written content to multiple subreddits with configurable delays.
 *
 * Setup:
 * 1. Go to https://www.reddit.com/prefs/apps
 * 2. Create a "script" type app
 * 3. Copy client_id (under app name) and client_secret
 * 4. Create .env file in this directory (see .env.example)
 * 5. npm install dotenv snoowrap
 * 6. node post-to-reddit.js [--dry-run] [--post=1]
 *
 * Flags:
 *   --dry-run   Print posts without submitting
 *   --post=N    Only post the Nth post (1-indexed)
 *   --delay=M   Minutes between posts (default: 45)
 */

const path = require('path');
const fs = require('fs');

// Load env from script directory
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.butterlemonade.rivulet';

const posts = [
  {
    subreddit: 'androidapps',
    title: 'I built a hydration tracker that\'s actually beautiful',
    body: `Hey everyone! I just released my first app — **Rivulet**, a water tracker that focuses on looking and feeling premium.

I was tired of hydration apps that look like medical software from 2010. I wanted something I'd actually enjoy opening throughout the day. So I built one with a full-screen liquid animation that fills up as you drink water.

**What makes it different:**
- GPU-rendered water animation that reacts to every glass you log
- Tap anywhere on screen to log — no tiny buttons
- Celebration effect with expanding ripple rings when you hit your goal
- Weekly bars + monthly dot grid for history
- Home screen widget
- Everything stored locally, no account needed

It's free with non-intrusive ads. No premium paywall, no subscription.

Would love any feedback from this community — you all have great taste in apps.

[Play Store link](${PLAY_STORE_URL})`,
    flair: 'New App',
  },
  {
    subreddit: 'SideProject',
    title: 'From idea to Play Store in 2 weeks: Rivulet, a minimalist water tracker',
    body: `Shipped my first side project to the Play Store! It's called **Rivulet** — a minimalist hydration tracker with beautiful liquid animations.

**The idea:** Every water tracker I tried was either ugly, bloated with features I didn't need, or wanted me to create an account to track *water*. I wanted something that felt like a luxury product but was dead simple.

**Tech stack:**
- React Native + Expo (managed workflow)
- Shopify's react-native-skia for GPU-rendered water animation
- Reanimated 3 for gesture physics
- EAS Build for cloud builds
- No backend — everything is AsyncStorage on device

**What I learned:**
1. Animations sell the experience. The water fill effect is what makes people actually open the app.
2. Less is more. I cut half the features I planned. Settings is just a goal number.
3. AdMob setup is surprisingly painful. The docs are... not great.
4. Having a home screen widget (Android) makes daily retention way better.

**Numbers so far:** Just launched, so nothing exciting yet. Hoping to get some organic traction.

If anyone has questions about the React Native + Skia animation pipeline, happy to share more details.

[Play Store](${PLAY_STORE_URL})`,
    flair: null,
  },
  {
    subreddit: 'reactnative',
    title: 'Built a GPU-rendered water animation app with Skia + Reanimated — here\'s how',
    body: `Just shipped a hydration tracker called **Rivulet** that uses @shopify/react-native-skia for the main visual — a full-screen water fill effect with sine wave surfaces, ripple rings on tap, and a celebration animation.

**Architecture overview:**

The water surface is two layered sine waves drawn on a Skia Canvas at 60fps:
- Primary wave: \`amplitude * sin(x * frequency + phase)\`
- Secondary wave: smaller amplitude, different frequency, offset phase
- Both use \`useClock()\` to animate the phase continuously
- Fill level is a Reanimated SharedValue driven by \`withSpring()\`

**Tap ripple:** On tap, an expanding circle is drawn with decreasing opacity (Reanimated timing → Skia Circle with animated radius and alpha).

**Celebration effect:** When glasses >= goal, three staggered ripple rings expand from center using \`withDelay\` + \`withTiming\`, and the wave amplitude surges 3.5x then decays over 2.5s.

**Gesture handling:** The app uses react-native-gesture-handler's \`Gesture.Pan()\` for horizontal swipe navigation between Home and History screens. The settings drawer uses a vertical pan gesture. Had to tune \`activeOffsetX/Y\` to prevent conflicts.

**Performance:** Skia renders on the GPU thread, so the JS thread stays free for gesture handling. On older devices (tested on a Pixel 4a), still holds 60fps with both waves + ripple active.

**Widget:** Android widget uses react-native-android-widget with a task handler that reads from AsyncStorage and renders a simple JSX widget.

Happy to answer any questions about the Skia setup or gesture conflicts.

[Play Store](${PLAY_STORE_URL})`,
    flair: null,
  },
  {
    subreddit: 'HydroHomies',
    title: 'Made a water tracker app that actually looks good — for my fellow hydro homies',
    body: `Been lurking here for a while and you all inspired me to take hydration more seriously. But every app I tried was ugly or annoying, so I built my own.

**Rivulet** has a full-screen water animation that fills up as you drink throughout the day. Just tap the screen for each glass. When you hit your goal, it does this satisfying ripple celebration.

It also has a widget so you can log water right from your home screen without opening the app.

No account needed, no subscription. Just a beautiful way to track your water.

[Play Store](${PLAY_STORE_URL})

Stay hydrated!`,
    flair: null,
  },
  {
    subreddit: 'minimalism',
    title: 'Built a water tracker app with minimalist design philosophy',
    body: `I've always been drawn to products that do one thing beautifully. Most hydration apps try to be health dashboards — tracking calories, sleep, exercise, weight, and oh also water I guess.

**Rivulet** just tracks water. That's it.

The entire UI is a water animation that fills the screen. Tap to log. Swipe for history. Pull down for settings (which is literally just a goal number). No onboarding questionnaire, no account creation, no social features, no streaks-for-the-sake-of-streaks.

Design choices:
- No navigation bar — gesture-based navigation only
- No color beyond the water itself (clean white/black depending on system theme)
- Typography: thin weights, generous spacing
- History is just vertical bars (week) and dots (month) — no graphs, no data export

Everything stays on your device. Nothing in the cloud.

It's free on the Play Store if anyone wants to try it: [Rivulet](${PLAY_STORE_URL})`,
    flair: null,
  },
];

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const postArg = args.find((a) => a.startsWith('--post='));
  const delayArg = args.find((a) => a.startsWith('--delay='));
  const postIndex = postArg ? parseInt(postArg.split('=')[1], 10) - 1 : null;
  const delayMinutes = delayArg ? parseInt(delayArg.split('=')[1], 10) : 45;

  const toPost = postIndex !== null ? [posts[postIndex]] : posts;

  if (dryRun) {
    console.log('=== DRY RUN — Nothing will be posted ===\n');
    for (const post of toPost) {
      console.log(`--- r/${post.subreddit} ---`);
      console.log(`Title: ${post.title}`);
      if (post.flair) console.log(`Flair: ${post.flair}`);
      console.log(`\n${post.body}\n`);
      console.log('---\n');
    }
    return;
  }

  // Validate env
  const required = ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    console.error('Create a .env file in scripts/marketing/ — see .env.example');
    process.exit(1);
  }

  const Snoowrap = require('snoowrap');
  const reddit = new Snoowrap({
    userAgent: 'rivulet-marketing/1.0 (by /u/' + process.env.REDDIT_USERNAME + ')',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });

  for (let i = 0; i < toPost.length; i++) {
    const post = toPost[i];

    if (i > 0) {
      console.log(`Waiting ${delayMinutes} minutes before next post...`);
      await new Promise((r) => setTimeout(r, delayMinutes * 60 * 1000));
    }

    console.log(`Posting to r/${post.subreddit}...`);
    try {
      const submission = await reddit.getSubreddit(post.subreddit).submitSelfpost({
        title: post.title,
        text: post.body,
        ...(post.flair ? { flairText: post.flair } : {}),
      });
      console.log(`  Posted: https://reddit.com${submission.permalink}`);
    } catch (err) {
      console.error(`  Failed: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
