# Changelog

All notable changes to **miccast** are documented here. The initial entry is
curated; subsequent entries are appended automatically by the release workflow
(`.github/workflows/release.yml`) from the commit messages in each release.

<!-- new-release-anchor -->

## [1.0.0] - 2026-06-26

- chore: pin deps to locked versions, move to Node 24
- ci: release from latest main and retry push on non-fast-forward
- docs: drop date from initial changelog entry
- docs: write meaningful initial changelog entry
- docs: add store screenshots
- chore: add metadata/ folder for store screenshots
- docs: document the release workflow and store publishing
- ci: add manual release workflow, changelog, and license
- docs: document development, local install, and publishing
- feat: microphone & speaker icons for commands, rows, and app tile
- fix: spawn vendored audio-devices binary from assetsPath
- fix: optimistic current-device update, dual-role test, lint and title polish
- feat: add set-input and set-output commands
- feat: add shared device list component
- test: cover getCurrent output routing and getDevices/getCurrent error propagation
- feat: add audio device wrapper module
- chore: commit package-lock.json
- chore: scaffold miccast Raycast extension
- Initial commit: miccast README


## [Initial Release]

- **Set Input Device** — switch the active microphone from a searchable list;
  the current device is marked so you always see what's selected.
- **Set Output Device** — switch the active speaker/headphone output the same
  way.
- Instant switching with a confirmation toast (“Now using: …”) and the window
  closes automatically.
- Each device row and command shows a microphone or speaker icon that adapts to
  Raycast's light and dark themes.
- Works out of the box on macOS — no Homebrew or extra tools to install; the
  CoreAudio helper ships inside the extension.
