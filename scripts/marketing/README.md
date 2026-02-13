# Rivulet Marketing Automation

Automated marketing toolkit for the Rivulet app launch.

## Quick Start

```bash
cd scripts/marketing
npm install dotenv snoowrap twitter-api-v2
cp .env.example .env
# Edit .env with your API credentials
```

## Scripts

### `launch.js` — Master Orchestrator
Runs the full launch sequence in phases:
```bash
node launch.js --dry-run          # Preview all posts
node launch.js --phase=1 --dry-run  # Preview phase 1 only
node launch.js --phase=1           # Execute phase 1
```

**Phases:**
1. Reddit seeding (r/androidapps, r/SideProject)
2. Reddit technical (r/reactnative, r/HydroHomies)
3. Twitter launch tweet
4. Reddit design (r/minimalism)
5. Twitter drip feed (remaining tweets)

### `post-to-reddit.js` — Reddit Poster
```bash
node post-to-reddit.js --dry-run    # Preview all posts
node post-to-reddit.js --post=1     # Post only the first one
node post-to-reddit.js --delay=60   # 60 min between posts
```

### `post-tweets.js` — Twitter/X Poster
```bash
node post-tweets.js --dry-run       # Preview all tweets
node post-tweets.js --tweet=1       # Post only the first one
```

### `deploy-landing-page.js` — GitHub Pages Deploy
```bash
node deploy-landing-page.js         # Deploy to your GitHub
node deploy-landing-page.js --org=butterlemonade  # Deploy to org
```

### `generate-promo-video.js` — Video Creator
```bash
node generate-promo-video.js        # Creates TikTok/Reels videos
# First run creates assets/recordings/ — put screen recordings there
```

## API Setup

### Reddit
1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app"
3. Choose "script" type
4. Set redirect URI to `http://localhost`
5. Copy client ID (under app name) and secret

### Twitter/X
1. Apply at https://developer.twitter.com
2. Create project + app
3. Enable OAuth 1.0a with Read and Write permissions
4. Generate access token + secret

### Product Hunt
1. Go to https://www.producthunt.com/v2/oauth/applications
2. Create app, get access token
3. Submit manually (API doesn't support posting products)

## Content Files

All pre-written content is in `docs/marketing/`:
- `reddit-posts.md` — 5 Reddit posts
- `product-hunt.md` — Product Hunt launch copy
- `social-media.md` — Twitter, Instagram, TikTok content
- `launch-schedule.md` — Day-by-day timeline

## Recommended Launch Order

1. Deploy landing page: `node deploy-landing-page.js`
2. Update store listing with privacy policy URL
3. Dry run everything: `node launch.js --dry-run`
4. Execute phase by phase: `node launch.js --phase=1`
5. Record screen videos, then: `node generate-promo-video.js`
6. Upload videos to TikTok/Instagram manually
