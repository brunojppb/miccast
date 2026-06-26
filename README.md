# miccast

A [Raycast](https://raycast.com) extension to quickly switch the active macOS
**microphone (input)** and **speaker/headphone (output)** device from a
searchable list — handy when you constantly move between a headset, an external
mic, AirPods, and the built-in MacBook devices.

## Commands

| Command | Icon | What it does |
| --- | --- | --- |
| **Set Input Device** | 🎙️ | Lists every input device; the active one is marked **Current**. Pick one to switch your microphone. |
| **Set Output Device** | 🔈 | Same, for speakers/headphones output. |

On selection the device switches immediately, a confirmation toast appears
(“Now using: …”), and the Raycast window closes.

## Requirements

- **macOS** (the extension talks to CoreAudio via a bundled helper binary — it
  is macOS-only by design).
- **[Raycast](https://raycast.com)** installed.
- **Node.js ≥ 22** and **npm** (only needed to build/develop, not to run).

No Homebrew or separate tools required — the `audio-devices` helper binary is
vendored into the extension (`assets/audio-devices`) and ships inside the
bundle.

## Develop

```bash
npm install      # install dependencies (compiles the native helper on macOS)
npm run dev      # start Raycast in development mode with live reload
```

`npm run dev` runs `ray develop`: Raycast imports the extension and it appears
in your root search instantly. Edit a file and it hot-reloads. Press `Ctrl-C`
to stop the dev server.

### Other scripts

```bash
npm test         # run the unit tests (vitest)
npm run lint     # ray lint (ESLint + Prettier + manifest/icon validation)
npm run fix-lint # auto-fix lint/format issues
npm run build    # ray build — distribution build + full type-check
```

## Install it into your own Raycast (personal use)

You do **not** need to publish to the store to use this yourself:

```bash
npm install
npm run dev
```

That imports the extension into Raycast. **It stays installed and usable even
after you stop the dev server** (`Ctrl-C`) — Raycast keeps it in
`~/.config/raycast/extensions/miccast/`. You'll find **Set Input Device** and
**Set Output Device** in Raycast root search and can bind hotkeys/aliases to
them in Raycast → Settings → Extensions.

To update later: `git pull`, then `npm install && npm run dev` once more.
To remove it: find it under Raycast → Settings → Extensions and remove it.

## How it works

```
src/
  audio.ts          Wrapper around the bundled `audio-devices` CLI binary.
                    Exposes getDevices() / getCurrent() / setDevice().
                    The ONLY module that touches the binary.
  device-list.tsx   Shared <List> component (parameterized by "input"|"output").
                    Loads devices, marks the current one, switches on select.
  set-input.tsx     Command entry → <DeviceList type="input" />
  set-output.tsx    Command entry → <DeviceList type="output" />
assets/
  audio-devices     Vendored CoreAudio helper binary (CLI).
  icon.png          Extension icon.
  microphone.png    Command-tile icons (+ @dark variants).
  speaker.png
design/             SVG sources for the icons (not bundled).
test/               Test-only stub for @raycast/api.
```

**Why a vendored binary?** Device switching is done by the
[`macos-audio-devices`](https://github.com/karaggeorge/macos-audio-devices)
helper, a small Swift/CoreAudio CLI. Its npm wrapper resolves the binary
relative to `__dirname`, which breaks once Raycast bundles the extension into a
single file. So the binary is copied into `assets/` (shipped in the bundle,
exposed at runtime as `environment.assetsPath`) and `audio.ts` invokes it
directly.

## Tech

Built with TypeScript + React on
[`@raycast/api`](https://developers.raycast.com), tested with
[Vitest](https://vitest.dev), and powered by
[`macos-audio-devices`](https://github.com/karaggeorge/macos-audio-devices).

## License

MIT
