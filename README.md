# AFTERLIGHT — A Signal Worth Saving

A cooperative rescue game for **2–6 explorers**. Different clues. One drone. A shared way home.

## Play
Open **https://sabahatseemeen2127-cmd.github.io/afterlight/**, create a room, and share the invite link or six-letter code. Each friend joins from their own phone or laptop before launch. No account or installation is required.

Each explorer sees different debris coordinates. Combine the private reports over the built-in radio or your own voice call. Flag hazards, plan 1–3 compass moves, approve the route together, and let the captain launch it. Rescue three lightkeepers and reach F6 before the battery empties.

- Start with 26 charge. Each step costs 1.
- Debris and boundary impacts cost 3 total and leave the drone in place.
- A rescue restores 3 charge.
- Every connected explorer approves the current route. Editing resets approvals.
- Three missions, solo practice, optional sound, mobile section navigation and an in-game field guide.

## Multiplayer hosting
This GitHub Pages edition uses PeerJS for signaling and WebRTC data channels for game traffic. The captain browser validates actions and sends each explorer only their own clue view. **Keep the captain tab open throughout the game.** The game does not request microphone or camera access.

A third-party signaling service and compatible WebRTC network connectivity are needed for multiplayer. Corporate/school firewalls or restrictive NAT may prevent a connection. Try a different network if connection fails. This edition has no configured paid TURN relay and cannot guarantee connectivity across every network. Solo practice works without the signaling service.

Refresh the same tab to attempt session recovery. Closing the captain tab interrupts the room. The authored maps are repeatable puzzles; source code is public, so private clues are a game mechanic rather than protection against deliberate cheating.

## Source and build
`GameClient.tsx` contains the interface, `game.ts` the rules, and `transport.ts` the peer-to-peer coordinator. `main.tsx` is the browser entrypoint. `style.css` contains the responsive design. `build.mjs` bundles everything into a self-contained `index.html`.

With Node.js 22+ and npm:

```sh
npm ci
npm run build
node test-game.mjs
```

Serve the folder with any static HTTP server to test. GitHub Pages serves the prebuilt root `index.html`; no server-side runtime is needed for this edition.

`server-source.zip` preserves the original React/Vinext + Cloudflare D1 server-backed edition. That edition requires its own Worker deployment and database migration; it is not what GitHub Pages runs.

## Verification
The shared engine was tested for 2–6 player clue distribution, legal winning routes on all missions, approval resets, stale edits, captain permissions, collisions and battery exhaustion. The GitHub Pages edition was browser-tested with two independent sessions: cloud signaling, room joining, distinct private clues, shared planning, both approvals, synchronized movement and crew radio.

Built with ChatGPT for the Handshake multiplayer game mission. Artwork is authored SVG, supplied in the original project. No paid assets are required.

