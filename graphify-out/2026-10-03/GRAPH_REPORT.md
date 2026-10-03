# Graph Report - uber  (2026-10-03)

## Corpus Check
- 59 files · ~15,110 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .css 2, .prob 1, (none) 1)

## Summary
- 314 nodes · 512 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aaca4653`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- app.js
- frontend/package.json
- auth.middleware.js
- ride.controller.js
- captain.controller.js
- Frontend HTML Shell
- ride.service.js
- backend/package.json
- dependencies
- Postman Workspace Resources
- package.json
- Graphify Knowledge Graph Rule
- App Icons Sprite SVG
- React + Vite Documentation
- React Logo Vector
- Vite Logo Vector
- User API Request
- Postman Workspace Globals
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `react-router-dom` - 19 edges
3. `express-validator` - 9 edges
4. `SocketContext` - 9 edges
5. `confirmRide()` - 7 edges
6. `startRide()` - 6 edges
7. `endRide()` - 6 edges
8. `express` - 6 edges
9. `mongoose` - 6 edges
10. `CaptainDataContext` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Frontend HTML Shell` --references--> `App Favicon SVG`  [EXTRACTED]
  frontend/index.html → frontend/public/favicon.svg
- `Captain API Collection Definition` --references--> `Postman Workspace Resources`  [EXTRACTED]
  postman/collections/captain/.resources/definition.yaml → .postman/resources.yaml
- `Map API Collection Definition` --references--> `Postman Workspace Resources`  [EXTRACTED]
  postman/collections/map/.resources/definition.yaml → .postman/resources.yaml
- `User API Collection Definition` --references--> `Postman Workspace Resources`  [EXTRACTED]
  postman/collections/user/.resources/definition.yaml → .postman/resources.yaml
- `createRide()` --calls--> `sendMessageToCaptains()`  [EXTRACTED]
  backend/controllers/ride.controller.js → backend/socket.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Captain API Suite** — postman_collections_captain_login_request_captain_login, postman_collections_captain_profile_request_captain_profile, postman_collections_captain_register_request_captain_register [INFERRED 0.85]
- **Frontend Static Brand Assets** — frontend_public_favicon_svg, frontend_public_icons_svg, frontend_src_assets_hero_png [INFERRED 0.85]
- **User API Suite** — postman_collections_user_login_request_user_login, postman_collections_user_profile_request_user_profile, postman_collections_user_new_request_1_request_user_register [INFERRED 0.85]

## Communities (20 total, 8 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.08
Nodes (41): App(), Uber Home Hero Graphic, CaptainDetails(), ConfirmRide(), ConfirmRidePopUp(), DriverLocation(), FinishRide(), LiveRideMap() (+33 more)

### Community 1 - "app.js"
Cohesion: 0.05
Nodes (41): app, captainRoutes, connectToDb, cookieParser, cors, dotenv, express, mapRoutes (+33 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.09
Nodes (24): axios, name, private, scripts, build, dev, lint, preview (+16 more)

### Community 3 - "auth.middleware.js"
Cohesion: 0.06
Nodes (28): blacklistModel, logoutUser(), userModel, userService, { validationResult }, mongoose, blacklistModel, captainModel (+20 more)

### Community 4 - "ride.controller.js"
Cohesion: 0.13
Nodes (22): confirmRide(), createRide(), endRide(), getFare(), getPendingRides(), rideService, { sendMessageToCaptains, sendMessageToUser, sendMessageToSocketId, broadcastEvent }, startRide() (+14 more)

### Community 5 - "captain.controller.js"
Cohesion: 0.17
Nodes (5): blacklistModel, captainModel, captainService, { validationResult }, captainModel

### Community 7 - "ride.service.js"
Cohesion: 0.11
Nodes (12): getDistanceTime(), getSuggestion(), mapService, { validationResult }, axios, getAddress(), getDistanceTime(), createRide() (+4 more)

### Community 9 - "backend/package.json"
Cohesion: 0.07
Nodes (26): author, dependencies, axios, bcrypt, cookie-parser, cors, dotenv, express (+18 more)

### Community 10 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, axios, gsap, @gsap/react, maplibre-gl, react, react-dom, react-router-dom (+4 more)

### Community 11 - "Postman Workspace Resources"
Cohesion: 0.50
Nodes (4): Postman Workspace Resources, Captain API Collection Definition, Map API Collection Definition, User API Collection Definition

### Community 12 - "package.json"
Cohesion: 0.50
Nodes (3): dependencies, cookie-parser, cookie-parser

### Community 20 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

## Knowledge Gaps
- **149 isolated node(s):** `dotenv`, `cors`, `express`, `app`, `connectToDb` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 172 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express-validator` connect `app.js` to `auth.middleware.js`, `ride.controller.js`, `captain.controller.js`, `ride.service.js`, `backend/package.json`?**
  _High betweenness centrality (0.279) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `dotenv`, `cors`, `express` to the rest of the system?**
  _149 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07785602503912363 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.050241545893719805 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._