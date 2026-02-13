# Product Hunt Launch

---

## Submission Details

### App Name

Rivulet — Water Tracker

### Tagline

> Beautiful water tracking with real fluid animation.

*(53 characters)*

### Description

> Track your daily water intake with a stunning full-screen liquid animation. Tap to log, watch the water rise. Free, private, no account needed. Includes widget, reminders, goal celebrations, and unlockable color themes.

*(219 characters)*

### Topics / Tags

1. Health & Fitness
2. Design Tools (or Productivity)
3. Android
4. iPhone

### Thumbnail / Gallery

- Screenshot 1: Main screen showing water animation at ~60% full
- Screenshot 2: Goal celebration with ripple rings
- Screenshot 3: Color theme variations (grid of 5)
- Screenshot 4: Widget on home screen
- Screenshot 5: Weekly history view

### Links

- **Website:** [butterlemonade.com or dedicated landing page]
- **Play Store:** [link]
- **App Store:** [link]

### Makers

- Butter Lemonade (info@butterlemonade.com)

---

## Maker Comment

Hey Product Hunt!

I built Rivulet because I had a simple problem: I don't drink enough water, and every tracking app I tried felt like homework.

I wanted something that was genuinely beautiful to look at and required almost zero effort to use. So I built a hydration tracker where the entire screen is a GPU-rendered water animation. You tap to log a glass, the water rises with a splash, and when you hit your goal, ripple rings cascade across the screen. That's basically the whole app.

A few things I'm proud of:

**It's private by default.** No account, no sign-up, no cloud sync. Your data stays on your device. I don't collect analytics, I don't track you, I don't sell anything. The app is free with non-intrusive ads, and you can unlock color themes by watching a rewarded ad (one-time watch, permanent unlock).

**The animation is real.** This isn't a GIF or a Lottie file. It's a live fluid simulation rendered on the GPU using React Native Skia. Layered sine waves, spring physics on the tap interaction, the works. It runs at 60fps on mid-range phones.

**It's intentionally minimal.** I cut features aggressively. No beverage types, no caffeine tracking, no Apple Health sync (yet). The app does one thing: help you drink more water by making it satisfying to track.

I'm a solo developer and this is a passion project. I'd love your honest feedback — what's working, what's missing, what would make you actually use this daily. I'm actively building and your input directly shapes what comes next.

Thanks for checking it out!

---

## First Day Comment Strategy

### Prepared Comment 1 — Response to "How is this different from other water trackers?"

> Honestly, functionally it's similar — you log water, it tracks your intake. The difference is entirely in how it feels to use. Most trackers treat hydration like a data entry problem. Rivulet treats it like a visual experience.
>
> The entire screen is a fluid animation that responds to your input. There's no progress bar — the water IS the progress. And the celebration when you hit your goal is legitimately satisfying.
>
> I found that the "feel" of the app is what made me actually stick with tracking. I tried other apps for years and always stopped after a week. With Rivulet, the act of logging is rewarding enough that I keep doing it. That's the real difference — not features, but friction.

### Prepared Comment 2 — Response to "What's the tech stack?" or "How did you build the animation?"

> Built with React Native and Expo. The water animation uses React Native Skia, which gives you a GPU-accelerated canvas inside a React Native app.
>
> The water surface is a composite of 3-4 sine waves with different frequencies and phase offsets, drawn as a Skia Path and filled with a gradient. The phase shifts continuously via Reanimated shared values running on the UI thread, so you get smooth 60fps without touching the JS thread.
>
> When you tap to log water, the level rises with a spring animation and I spike the wave amplitude briefly so it looks like a splash. The ripple celebration is concentric circles with staggered radius/opacity animations.
>
> The tricky part was performance on mid-range Android. I keep the path sample count low (~40 points across the screen width) and precompute trig values where possible. Reanimated worklets handle all the per-frame math.
>
> Happy to go deeper on any of this if you're curious.

### Prepared Comment 3 — Response to "Why free? What's the business model?" or "Will it stay free?"

> It's free with ads and will stay that way. I don't want a paywall between someone and drinking water.
>
> The model is simple: there's a standard banner ad, and you can unlock cosmetic color themes by watching a rewarded ad. One watch per theme, and the unlock is permanent. That's it. No subscription, no premium tier, no "unlock reminders for $2.99."
>
> I also don't collect any user data — no accounts, no analytics, no tracking. Your hydration data stays on your phone. So I'm not in the "sell user data" business either.
>
> Honestly, this is a passion project. If the ads cover my developer account fees and occasional coffee, I'm happy. The goal is to make something people love using, and sustainable revenue lets me keep working on it without compromising the experience.
