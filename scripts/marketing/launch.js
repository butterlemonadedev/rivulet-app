#!/usr/bin/env node
/**
 * Rivulet Marketing Launch Orchestrator
 *
 * Master script that coordinates the full launch sequence.
 * Run with: node launch.js [--phase=N] [--dry-run]
 *
 * Phases:
 *   1 — Reddit seeding (r/androidapps, r/SideProject) — Day 1-2
 *   2 — Reddit technical (r/reactnative, r/HydroHomies) — Day 2-3
 *   3 — Twitter launch thread — Day 3
 *   4 — Reddit design (r/minimalism) — Day 4
 *   5 — All remaining tweets — Day 5-7
 */

const { execSync } = require('child_process');
const path = require('path');

const phases = [
  {
    name: 'Phase 1: Reddit Seeding',
    description: 'Post to r/androidapps and r/SideProject',
    commands: [
      'node post-to-reddit.js --post=1',
      'WAIT:45',
      'node post-to-reddit.js --post=2',
    ],
  },
  {
    name: 'Phase 2: Reddit Technical',
    description: 'Post to r/reactnative and r/HydroHomies',
    commands: [
      'node post-to-reddit.js --post=3',
      'WAIT:45',
      'node post-to-reddit.js --post=4',
    ],
  },
  {
    name: 'Phase 3: Twitter Launch',
    description: 'Post launch announcement tweet',
    commands: [
      'node post-tweets.js --tweet=1',
    ],
  },
  {
    name: 'Phase 4: Reddit Design',
    description: 'Post to r/minimalism',
    commands: [
      'node post-to-reddit.js --post=5',
    ],
  },
  {
    name: 'Phase 5: Twitter Drip Feed',
    description: 'Post remaining tweets over time',
    commands: [
      'node post-tweets.js --tweet=2',
      'WAIT:120',
      'node post-tweets.js --tweet=3',
      'WAIT:120',
      'node post-tweets.js --tweet=4',
      'WAIT:120',
      'node post-tweets.js --tweet=5',
    ],
  },
];

async function sleep(minutes) {
  console.log(`  Waiting ${minutes} minutes...`);
  await new Promise((r) => setTimeout(r, minutes * 60 * 1000));
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const phaseArg = args.find((a) => a.startsWith('--phase='));
  const phaseNum = phaseArg ? parseInt(phaseArg.split('=')[1], 10) : null;

  const toRun = phaseNum ? [phases[phaseNum - 1]] : phases;

  console.log('========================================');
  console.log(' Rivulet Marketing Launch Orchestrator');
  console.log('========================================\n');

  if (dryRun) {
    console.log('DRY RUN MODE — adding --dry-run to all commands\n');
  }

  for (const phase of toRun) {
    console.log(`\n--- ${phase.name} ---`);
    console.log(`${phase.description}\n`);

    for (const cmd of phase.commands) {
      if (cmd.startsWith('WAIT:')) {
        const mins = parseInt(cmd.split(':')[1], 10);
        if (!dryRun) {
          await sleep(mins);
        } else {
          console.log(`  [Would wait ${mins} minutes]`);
        }
        continue;
      }

      const fullCmd = dryRun ? `${cmd} --dry-run` : cmd;
      console.log(`  Running: ${fullCmd}`);
      try {
        const output = execSync(fullCmd, {
          cwd: __dirname,
          encoding: 'utf-8',
          stdio: 'pipe',
        });
        console.log(output.split('\n').map((l) => `    ${l}`).join('\n'));
      } catch (err) {
        console.error(`  Error: ${err.message}`);
      }
    }
  }

  console.log('\n========================================');
  console.log(' Launch sequence complete!');
  console.log('========================================');
}

main().catch(console.error);
