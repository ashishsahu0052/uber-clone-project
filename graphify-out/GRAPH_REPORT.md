# Graph Report - uber  (2026-09-24)

## Corpus Check
- 66 files · ~23,820 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: .prob 19, (none) 2, .css 2)

## Summary
- 352 nodes · 527 edges · 27 communities (22 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `185b1b5a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- captain.controller.js
- backend/package.json
- app.js
- frontend/package.json
- user.controller.js
- ride.controller.js
- ride.service.js
- dependencies
- dependencies
- What You Must Do When Invoked
- graphify reference: extra exports and benchmark
- captain.model.js
- auth.middleware.js
- blacklistToken.model.js
- user.model.js
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- React + Vite
- package.json
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- extraction-spec.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `react` - 29 edges
2. `react-router-dom` - 19 edges
3. `What You Must Do When Invoked` - 12 edges
4. `/graphify` - 10 edges
5. `express-validator` - 9 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `SocketContext` - 7 edges
8. `confirmRide()` - 6 edges
9. `express` - 6 edges
10. `mongoose` - 6 edges

## Surprising Connections (you probably didn't know these)
- `createRide()` --calls--> `sendMessageToCaptains()`  [EXTRACTED]
  backend/controllers/ride.controller.js → backend/socket.js
- `confirmRide()` --calls--> `sendMessageToCaptains()`  [EXTRACTED]
  backend/controllers/ride.controller.js → backend/socket.js
- `confirmRide()` --calls--> `sendMessageToSocketId()`  [EXTRACTED]
  backend/controllers/ride.controller.js → backend/socket.js
- `confirmRide()` --calls--> `sendMessageToUser()`  [EXTRACTED]
  backend/controllers/ride.controller.js → backend/socket.js
- `startRide()` --calls--> `sendMessageToSocketId()`  [EXTRACTED]
  backend/controllers/ride.controller.js → backend/socket.js

## Import Cycles
- None detected.

## Communities (27 total, 5 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.08
Nodes (37): App(), CaptainDetails(), ConfirmRide(), ConfirmRidePopUp(), FinishRide(), LocationSearchPanel(), LookingForDriver(), RidePopUp() (+29 more)

### Community 1 - "captain.controller.js"
Cohesion: 0.22
Nodes (4): blacklistModel, captainModel, captainService, { validationResult }

### Community 2 - "backend/package.json"
Cohesion: 0.14
Nodes (13): author, description, axios, cookie-parser, keywords, license, main, name (+5 more)

### Community 3 - "app.js"
Cohesion: 0.06
Nodes (34): app, captainRoutes, connectToDb, cookieParser, cors, dotenv, express, mapRoutes (+26 more)

### Community 4 - "frontend/package.json"
Cohesion: 0.07
Nodes (33): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+25 more)

### Community 5 - "user.controller.js"
Cohesion: 0.18
Nodes (6): blacklistModel, logoutUser(), userModel, userService, { validationResult }, userModel

### Community 6 - "ride.controller.js"
Cohesion: 0.12
Nodes (22): confirmRide(), createRide(), endRide(), getFare(), getPendingRides(), rideService, { sendMessageToCaptains, sendMessageToUser, sendMessageToSocketId }, startRide() (+14 more)

### Community 7 - "ride.service.js"
Cohesion: 0.09
Nodes (14): getDistanceTime(), getSuggestion(), mapService, { validationResult }, mongoose, rideSchema, axios, getAddress() (+6 more)

### Community 8 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, axios, bcrypt, cookie-parser, cors, dotenv, express, express-validator (+4 more)

### Community 9 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, axios, gsap, @gsap/react, react, react-dom, react-router-dom, remixicon (+3 more)

### Community 10 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 11 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 12 - "captain.model.js"
Cohesion: 0.22
Nodes (6): bcrypt, captainModel, captainSchema, jwt, mongoose, captainModel

### Community 13 - "auth.middleware.js"
Cohesion: 0.25
Nodes (5): blacklistModel, captainModel, jwt, userModel, jsonwebtoken

### Community 14 - "blacklistToken.model.js"
Cohesion: 0.29
Nodes (4): mongoose, blacklistTokenSchema, mongoose, mongoose

### Community 15 - "user.model.js"
Cohesion: 0.29
Nodes (6): bcrypt, jwt, mongoose, userModel, userSchema, bcrypt

### Community 16 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 17 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 18 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 19 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 20 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 21 - "package.json"
Cohesion: 0.50
Nodes (3): dependencies, cookie-parser, cookie-parser

## Knowledge Gaps
- **173 isolated node(s):** `dotenv`, `cors`, `express`, `app`, `connectToDb` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 208 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express-validator` connect `app.js` to `captain.controller.js`, `backend/package.json`, `user.controller.js`, `ride.controller.js`, `ride.service.js`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `dotenv`, `cors`, `express` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08344988344988345 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06072874493927125 - nodes in this community are weakly interconnected._