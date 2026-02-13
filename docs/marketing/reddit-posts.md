# Reddit Posts for Rivulet Launch

---

## Post 1 — r/androidapps

**Subreddit:** r/androidapps

**Suggested Flair:** `New App`

**Title:** I built a hydration tracker that's actually beautiful

**Body:**

Hey everyone,

I've been using water tracking apps on and off for years and they all kind of... look the same? Flat UI, boring progress bars, the usual. I got frustrated enough to build my own.

**Rivulet** is a hydration tracker I made because I wanted something that actually felt nice to use. The core idea was simple: what if logging water felt as satisfying as the water itself?

Here's what makes it different:

- **Full-screen liquid animation** — not a clipart water droplet, an actual GPU-rendered fluid simulation that fills your screen as you drink. It responds to your phone's movement and looks genuinely gorgeous.
- **Tap to log** — no menus, no dropdowns, no "select your container size" workflow. Just tap.
- **Home screen widget** — glance at your progress without opening the app.
- **Daily reminders** — gentle nudges, not aggressive notifications.
- **Goal celebrations** — when you hit your daily goal, you get this ripple ring animation that honestly makes me smile every time.
- **5 color themes** — unlockable through rewarded ads (watch a short ad, get a theme forever).

It's **free with ads**, no account needed. All your data stays on your device — I don't collect anything. No analytics, no tracking, no server. Your hydration data is yours.

I'm a solo dev and this is a passion project. I'd genuinely love to hear what you think — what's missing, what's annoying, what works. I'm actively developing it and real feedback is gold.

[Play Store Link]

Thanks for checking it out!

---

## Post 2 — r/sideproject

**Subreddit:** r/sideproject

**Suggested Flair:** `Show /r/sideproject`

**Title:** From idea to Play Store in 2 weeks: Rivulet, a minimalist water tracker

**Body:**

I shipped a thing. Wanted to share the journey since this sub was a huge motivation for me.

**The idea:** I drink water. I forget to drink water. I've tried every tracker app out there and they all feel like medical forms. I wanted one that was beautiful and dead simple.

**The result:** [Rivulet — Water Tracker](link)

**What I built:**

A hydration tracker where the entire screen is a living water animation. You tap to log, the water level rises, and when you hit your goal, these ripple rings cascade across the screen. It's the kind of thing you show people not because it's useful but because it looks incredible.

Features: widget, reminders, weekly/monthly history, 5 color themes, goal celebrations. Free, no account, all data local.

**Tech stack for the curious:**

- React Native + Expo
- React Native Skia for the water animation (GPU-rendered, runs at 60fps)
- Reanimated for gesture handling
- Local storage only, zero backend

**What I learned:**

1. **Scope is everything.** My original plan had social features, cloud sync, Apple Health integration. I cut all of it. The app does one thing and does it well.
2. **Animation is harder than it looks.** Getting the water physics to feel right took more time than every other feature combined. Sine wave composition, damping, the surface tension effect — I went down a rabbit hole.
3. **"Free with ads" is a valid model for solo devs.** I was back and forth on pricing. Ultimately I wanted zero friction. No paywall, no account, no trial. Rewarded ads for cosmetic unlocks felt like the right compromise.
4. **Ship before you're ready.** There are things I want to add. But it works, it's polished where it matters, and real users will tell me what actually needs to happen next.

**What's next:**

Listening to feedback. Probably Apple Health / Google Fit integration, more themes, maybe custom container sizes. But I want real usage data (well, feedback — I don't collect data) before I build more.

Would love your thoughts. Tear it apart if you want — that's how it gets better.

---

## Post 3 — r/reactnative

**Subreddit:** r/reactnative

**Suggested Flair:** `Show Case`

**Title:** Built a GPU-rendered water animation hydration app with Skia + Reanimated

**Body:**

Just shipped my first real app with React Native Skia and wanted to share some technical details since I learned a lot from this community.

**The app:** Rivulet — a hydration tracker where the main UI element is a full-screen water simulation.

**The water animation:**

This was the fun part. The water surface is built from layered sine waves with different frequencies and amplitudes. Here's the general approach:

- 3-4 sine waves composited together for the surface line
- Each wave has slightly different frequency, amplitude, and phase offset
- The phase shifts over time via `useSharedValue` to create continuous movement
- Amplitude is tied to the water level (more water = calmer surface, less water = more active)
- The whole thing is drawn as a `Path` in Skia, filled with a gradient

When you tap to add water, the level rises with a spring animation (Reanimated), and I add a brief amplitude spike that decays — so it looks like the water is "splashing" from the input.

**The celebration effect:**

When you hit 100%, concentric ripple rings expand outward from the center. Each ring is a Skia `Circle` with animated radius and opacity. They're staggered with `withDelay` and use `withTiming` with an ease-out curve. Simple concept but it looks really satisfying.

**Performance notes:**

- Everything runs on the UI thread via Reanimated worklets
- Skia's `Canvas` handles the GPU rendering
- Steady 60fps on mid-range Android devices (tested on Pixel 4a, Samsung A52)
- The key was keeping the path point count low — I sample ~40 points across the screen width for the wave, which is plenty for a smooth curve

**Gesture handling:**

Tap detection uses `GestureDetector` from react-native-gesture-handler. I originally tried `Pressable` but the animation coordination was cleaner with gesture handler + Reanimated.

**Gotchas I ran into:**

1. Skia path animations can get janky if you're recreating the path object every frame. Reuse and mutate instead.
2. `useFrameCallback` from Skia is great for the continuous wave animation, but make sure your calculations are lightweight — I moved expensive trig into lookup tables.
3. Testing on real Android devices early saved me. The emulator doesn't accurately represent Skia performance.

The app is free, no account needed, all data local. Built with Expo.

Happy to answer questions about the Skia implementation or the animation math. This community's posts about Skia were incredibly helpful when I was getting started.

[App Store / Play Store links]

---

## Post 4 — r/water

**Subreddit:** r/water (or r/HydroHomies as an alternative)

**Suggested Flair:** None (or community-specific)

**Title:** Found a water tracker that actually makes me want to drink more

**Body:**

Okay I know this sounds like an ad but I promise it's not — I actually made this app myself because I was terrible at staying hydrated.

I'm the kind of person who puts a water bottle on my desk at 9am and it's still full at 5pm. I've tried reminder apps before but they all felt like chores. Open app, tap plus, tap amount, tap confirm, close app. So I just... stopped using them.

I built **Rivulet** to fix this for myself. The whole screen is a water animation that fills up as you drink throughout the day. You just tap to log — that's it. And when you hit your daily goal, you get this really satisfying ripple animation.

What actually changed my habits:

- **The widget.** Having my water level visible on my home screen without opening anything creates this passive awareness. I glance at my phone and think "oh right, water."
- **The reminders.** Not aggressive. Just a gentle "hey, you haven't logged in a while."
- **The visual.** This sounds dumb but watching the water level rise is genuinely motivating. It's like a game where the only move is drinking water.

It's free, no sign-up, doesn't collect any data. Just a simple tool for drinking more water.

Anyone else struggle with this? What's worked for you? I'm always looking for more hydration strategies beyond just "have an app yell at you."

---

## Post 5 — r/Design

**Subreddit:** r/Design

**Suggested Flair:** `App Design` or `Digital Design`

**Title:** Designing a "minimalist luxury" hydration tracker — my process and thinking

**Body:**

I recently designed and built a hydration tracking app called **Rivulet** and wanted to share the design philosophy since I think the approach might resonate here.

**The brief I gave myself:** Make a water tracker that feels like a high-end product, not a medical utility. Think Aesop packaging, not MyFitnessPal.

**Core design principles:**

**1. The content is the interface.**

Most hydration apps have a screen with various UI elements and somewhere in there is a number or a progress bar telling you how much you've drunk. I flipped that — the entire screen IS the water. A full-bleed fluid animation that represents your progress. There's almost no traditional UI.

**2. Reduce interactions to the absolute minimum.**

Tap to log. That's the primary interaction. No container selection, no unit pickers, no "what type of beverage" modals. Every screen, every modal, every dropdown I considered adding — I asked "does this serve hydration?" and if the answer was "it serves data" I cut it.

**3. Celebrate the goal, not the grind.**

Most trackers show you a progress bar filling up, which is fine but forgettable. When you hit your daily goal in Rivulet, concentric ripple rings expand across the screen. It's a moment. It makes you want to hit that goal again tomorrow.

**4. Color as reward.**

The app ships with one color theme. Four more are unlockable. Each theme changes the water gradient, the background, and the accent colors. This makes color meaningful — it's not a settings page you visit once, it's a thing you earned and chose.

**5. Typography and negative space.**

The numeric display (current intake / goal) uses a thin, high-contrast typeface against the fluid background. No labels, no units on screen by default. The information hierarchy is: water animation > number > everything else.

**What I'd do differently:**

- I spent too long on the animation and not enough on the history screens. They're functional but don't carry the same design language. That's next.
- I wish I'd designed the widget first. It's the most-seen element and it was an afterthought.

Would love feedback from this community. What works? What feels off? Roast welcome.

[Screenshots / link]
