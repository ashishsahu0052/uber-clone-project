# Graph Report - uber  (2026-10-03)

## Corpus Check
- 59 files · ~15,945 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .css 2, .prob 1, (none) 1)

## Summary
- 317 nodes · 519 edges · 24 communities (17 shown, 7 thin omitted)
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
- captain.controller.js
- user.model.js
- ride.service.js
- Home.jsx
- blacklistToken.model.js
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
- user.controller.js
- auth.middleware.js
- captain.model.js

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `react-router-dom` - 19 edges
3. `express-validator` - 9 edges
4. `SocketContext` - 9 edges
5. `confirmRide()` - 7 edges
6. `startRide()` - 7 edges
7. `endRide()` - 7 edges
8. `express` - 6 edges
9. `mongoose` - 6 edges
10. `CaptainDataContext` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Captain API Collection Definition` --references--> `Postman Workspace Resources`  [EXTRACTED]
  postman/collections/captain/.resources/definition.yaml → .postman/resources.yaml
- `Map API Collection Definition` --references--> `Postman Workspace Resources`  [EXTRACTED]
  postman/collections/map/.resources/definition.yaml → .postman/resources.yaml
- `User API Collection Definition` --references--> `Postman Workspace Resources`  [EXTRACTED]
  postman/collections/user/.resources/definition.yaml → .postman/resources.yaml
- `Frontend HTML Shell` --references--> `App Favicon SVG`  [EXTRACTED]
  frontend/index.html → frontend/public/favicon.svg
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
Cohesion: 0.10
Nodes (35): Frontend HTML Shell, App Favicon SVG, App(), CaptainDetails(), ConfirmRidePopUp(), DriverLocation(), LiveRideMap(), NOTE: Do not call OSRM on GPS updates (+27 more)

### Community 1 - "app.js"
Cohesion: 0.05
Nodes (41): app, captainRoutes, connectToDb, cookieParser, cors, dotenv, express, mapRoutes (+33 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.10
Nodes (22): axios, name, private, scripts, build, dev, lint, preview (+14 more)

### Community 3 - "backend/package.json"
Cohesion: 0.07
Nodes (26): author, dependencies, axios, bcrypt, cookie-parser, cors, dotenv, express (+18 more)

### Community 4 - "ride.controller.js"
Cohesion: 0.12
Nodes (24): captainModel, confirmRide(), createRide(), endRide(), getFare(), getPendingRides(), rideService, { sendMessageToCaptains, sendMessageToUser, sendMessageToSocketId, sendMessageToRideRoom, broadcastEvent } (+16 more)

### Community 5 - "captain.controller.js"
Cohesion: 0.17
Nodes (5): blacklistModel, captainModel, captainService, { validationResult }, captainModel

### Community 6 - "user.model.js"
Cohesion: 0.20
Nodes (7): bcrypt, jwt, mongoose, userModel, userSchema, userModel, bcrypt

### Community 7 - "ride.service.js"
Cohesion: 0.09
Nodes (14): getDistanceTime(), getSuggestion(), mapService, { validationResult }, mongoose, rideSchema, axios, getAddress() (+6 more)

### Community 8 - "Home.jsx"
Cohesion: 0.14
Nodes (11): Uber Home Hero Graphic, ConfirmRide(), FinishRide(), LocationSearchPanel(), LookingForDriver(), VehiclePanel(), WaitingForDriver(), CaptainRiding() (+3 more)

### Community 9 - "blacklistToken.model.js"
Cohesion: 0.29
Nodes (4): mongoose, blacklistTokenSchema, mongoose, mongoose

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

### Community 21 - "user.controller.js"
Cohesion: 0.25
Nodes (5): blacklistModel, logoutUser(), userModel, userService, { validationResult }

### Community 22 - "auth.middleware.js"
Cohesion: 0.29
Nodes (4): blacklistModel, captainModel, jwt, userModel

### Community 23 - "captain.model.js"
Cohesion: 0.29
Nodes (6): bcrypt, captainModel, captainSchema, jwt, mongoose, jsonwebtoken

## Knowledge Gaps
- **150 isolated node(s):** `dotenv`, `cors`, `express`, `app`, `connectToDb` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 174 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express-validator` connect `app.js` to `backend/package.json`, `ride.controller.js`, `captain.controller.js`, `ride.service.js`, `user.controller.js`?**
  _High betweenness centrality (0.266) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `Home.jsx`, `frontend/package.json`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `App.jsx` to `Home.jsx`, `frontend/package.json`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `dotenv`, `cors`, `express` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09586466165413533 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.050241545893719805 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._