# Graph Report - uber  (2026-10-04)

## Corpus Check
- 60 files · ~21,426 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .css 2, .prob 1, (none) 1)

## Summary
- 368 nodes · 571 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f4b0992`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- app.js
- frontend/package.json
- backend/package.json
- ride.controller.js
- auth.middleware.js
- ride.service.js
- 🚖 Uber Clone — Full-Stack Real-Time Ride Hailing & Live Navigation Platform
- captain.controller.js
- dependencies
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
- user.routes.js
- map.routes.js
- ride.routes.js

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `🚖 Uber Clone — Full-Stack Real-Time Ride Hailing & Live Navigation Platform` - 25 edges
3. `react-router-dom` - 19 edges
4. `express-validator` - 9 edges
5. `SocketContext` - 9 edges
6. `confirmRide()` - 7 edges
7. `startRide()` - 7 edges
8. `endRide()` - 7 edges
9. `express` - 6 edges
10. `mongoose` - 6 edges

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

## Communities (24 total, 7 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.07
Nodes (45): Frontend HTML Shell, App Favicon SVG, App(), Uber Home Hero Graphic, CaptainDetails(), ConfirmRide(), ConfirmRidePopUp(), DriverLocation() (+37 more)

### Community 1 - "app.js"
Cohesion: 0.17
Nodes (11): app, captainRoutes, connectToDb, cookieParser, cors, dotenv, express, mapRoutes (+3 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.10
Nodes (23): axios, name, private, scripts, build, dev, lint, preview (+15 more)

### Community 3 - "backend/package.json"
Cohesion: 0.13
Nodes (14): author, description, axios, cookie-parser, keywords, license, main, name (+6 more)

### Community 4 - "ride.controller.js"
Cohesion: 0.12
Nodes (25): captainModel, confirmRide(), createRide(), endRide(), getFare(), getPendingRides(), rideService, { sendMessageToCaptains, sendMessageToUser, sendMessageToSocketId, sendMessageToRideRoom, broadcastEvent } (+17 more)

### Community 5 - "auth.middleware.js"
Cohesion: 0.06
Nodes (28): blacklistModel, logoutUser(), userModel, userService, { validationResult }, mongoose, blacklistModel, captainModel (+20 more)

### Community 6 - "ride.service.js"
Cohesion: 0.10
Nodes (13): getDistanceTime(), getRoute(), getSuggestion(), mapService, { validationResult }, axios, getAddress(), getDistanceTime() (+5 more)

### Community 7 - "🚖 Uber Clone — Full-Stack Real-Time Ride Hailing & Live Navigation Platform"
Cohesion: 0.04
Nodes (48): 10. Live Map & Navigation Using MapLibre + OSRM, 11. Authentication & Authorization, 12. Database Information, 13. API Overview & Endpoints, 14. Ride Lifecycle, 15. Project Folder Structure, 16. Environment Variables, 17. Installation & Setup Instructions (+40 more)

### Community 8 - "captain.controller.js"
Cohesion: 0.10
Nodes (13): blacklistModel, captainModel, captainService, { validationResult }, authmiddleware, { body }, captainController, express (+5 more)

### Community 9 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, axios, bcrypt, cookie-parser, cors, dotenv, express, express-validator (+4 more)

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

### Community 21 - "user.routes.js"
Cohesion: 0.22
Nodes (8): authMiddleware, { body }, express, router, userController, User Login API Request, User Register API Request, User Profile API Request

### Community 22 - "map.routes.js"
Cohesion: 0.25
Nodes (7): authMiddleware, express, mapController, { query }, router, Get Distance Time API Request, express

### Community 23 - "ride.routes.js"
Cohesion: 0.29
Nodes (6): authMiddleware, { body, query }, express, rideController, router, express-validator

## Knowledge Gaps
- **190 isolated node(s):** `dotenv`, `cors`, `express`, `app`, `connectToDb` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 215 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express-validator` connect `ride.routes.js` to `backend/package.json`, `ride.controller.js`, `auth.middleware.js`, `ride.service.js`, `captain.controller.js`, `user.routes.js`, `map.routes.js`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `dotenv`, `cors`, `express` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07157894736842105 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._