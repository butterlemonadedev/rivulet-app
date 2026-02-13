#!/usr/bin/env node
/**
 * Twitter/X Auto-Poster for Rivulet Marketing
 *
 * Posts pre-written tweets with configurable delays.
 *
 * Setup:
 * 1. Apply for Twitter Developer access: https://developer.twitter.com
 * 2. Create a project + app with OAuth 1.0a (Read and Write)
 * 3. Generate access token + secret
 * 4. Add credentials to .env file
 * 5. npm install dotenv twitter-api-v2
 * 6. node post-tweets.js [--dry-run] [--tweet=1]
 */

const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.butterlemonade.rivulet';

const tweets = [
  {
    text: `Just shipped my first app!

Rivulet is a water tracker that's actually beautiful — full-screen liquid animation, tap to log, celebration ripples when you hit your goal.

No account. No subscription. Just water.

${PLAY_STORE_URL}`,
    label: 'Launch announcement',
  },
  {
    text: `Most hydration apps look like medical software from 2010.

So I built one with GPU-rendered water animation, gesture-based navigation, and a minimalist design you'd actually want to look at.

Meet Rivulet.

${PLAY_STORE_URL}`,
    label: 'Design focus',
  },
  {
    text: `Built a water tracker in 2 weeks with:
- React Native + Expo
- Shopify's Skia for GPU water animation
- Reanimated for gesture physics
- Zero backend (everything on device)

Turned out way better than expected. Free on Play Store.

${PLAY_STORE_URL}`,
    label: 'Dev story',
  },
  {
    text: `Tip: put a water tracker widget on your home screen.

You'll drink more water just because it's staring at you every time you check your phone.

I may be biased because I built one, but still — it works.

${PLAY_STORE_URL}`,
    label: 'Hydration tip',
  },
  {
    text: `The moment your water tracker does this when you hit your daily goal >>

(3 expanding ripple rings + wave surge)

Small details make the difference between an app you use once and one you open every day.

${PLAY_STORE_URL}`,
    label: 'Celebration showcase',
  },
];

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const tweetArg = args.find((a) => a.startsWith('--tweet='));
  const delayArg = args.find((a) => a.startsWith('--delay='));
  const tweetIndex = tweetArg ? parseInt(tweetArg.split('=')[1], 10) - 1 : null;
  const delayMinutes = delayArg ? parseInt(delayArg.split('=')[1], 10) : 120;

  const toPost = tweetIndex !== null ? [tweets[tweetIndex]] : tweets;

  if (dryRun) {
    console.log('=== DRY RUN — Nothing will be posted ===\n');
    for (const tweet of toPost) {
      console.log(`--- ${tweet.label} (${tweet.text.length} chars) ---`);
      console.log(tweet.text);
      console.log('---\n');
    }
    return;
  }

  const required = ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    console.error('Add Twitter credentials to .env — see .env.example');
    process.exit(1);
  }

  const { TwitterApi } = require('twitter-api-v2');
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const rwClient = client.readWrite;

  for (let i = 0; i < toPost.length; i++) {
    const tweet = toPost[i];

    if (i > 0) {
      console.log(`Waiting ${delayMinutes} minutes before next tweet...`);
      await new Promise((r) => setTimeout(r, delayMinutes * 60 * 1000));
    }

    console.log(`Tweeting: ${tweet.label}...`);
    try {
      const result = await rwClient.v2.tweet(tweet.text);
      console.log(`  Posted: https://twitter.com/i/status/${result.data.id}`);
    } catch (err) {
      console.error(`  Failed: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
