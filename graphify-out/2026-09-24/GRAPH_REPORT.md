# Graph Report - uber  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 250 nodes · 389 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `185b1b5a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- auth.middleware.js
- app.js
- captain.routes.js
- frontend/package.json
- user.controller.js
- Home.jsx
- map.controller.js
- dependencies
- dependencies
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `react` - 27 edges
2. `react-router-dom` - 17 edges
3. `express-validator` - 9 edges
4. `mongoose` - 6 edges
5. `express` - 6 edges
6. `scripts` - 5 edges
7. `CaptainDataContext` - 4 edges
8. `gsap` - 4 edges
9. `@gsap/react` - 4 edges
10. `jsonwebtoken` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.11
Nodes (27): App(), CaptainDetails(), ConfirmRidePopUp(), FinishRide(), RidePopUp(), CaptainContext(), CaptainDataContext, UserContext() (+19 more)

### Community 1 - "auth.middleware.js"
Cohesion: 0.06
Nodes (25): blacklistModel, captainModel, captainService, { validationResult }, mongoose, blacklistModel, captainModel, jwt (+17 more)

### Community 2 - "app.js"
Cohesion: 0.07
Nodes (28): app, captainRoutes, connectToDb, cookieParser, cors, dotenv, express, mapRoutes (+20 more)

### Community 3 - "captain.routes.js"
Cohesion: 0.08
Nodes (25): createRide(), rideService, { validationResult }, authmiddleware, { body }, captainController, express, router (+17 more)

### Community 4 - "frontend/package.json"
Cohesion: 0.10
Nodes (22): axios, name, private, scripts, build, dev, lint, preview (+14 more)

### Community 5 - "user.controller.js"
Cohesion: 0.10
Nodes (13): blacklistModel, logoutUser(), userModel, userService, { validationResult }, mongoose, rideSchema, createRide() (+5 more)

### Community 6 - "Home.jsx"
Cohesion: 0.24
Nodes (6): ConfirmRide(), LocationSearchPanel(), LookingForDriver(), VehiclePanel(), WaitingForDriver(), Home()

### Community 7 - "map.controller.js"
Cohesion: 0.20
Nodes (7): getDistanceTime(), getSuggestion(), mapService, { validationResult }, axios, getAddress(), getDistanceTime()

### Community 8 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, axios, bcrypt, cookie-parser, cors, dotenv, express, express-validator (+3 more)

### Community 9 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, axios, gsap, @gsap/react, react, react-dom, react-router-dom, remixicon (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

## Knowledge Gaps
- **119 isolated node(s):** `blacklistModel`, `captainModel`, `captainService`, `{ validationResult }`, `mongoose` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 137 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express-validator` connect `captain.routes.js` to `auth.middleware.js`, `app.js`, `user.controller.js`, `map.controller.js`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `frontend/package.json`, `Home.jsx`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `App.jsx` to `frontend/package.json`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `blacklistModel`, `captainModel`, `captainService` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10549645390070922 - nodes in this community are weakly interconnected._
- **Should `auth.middleware.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05897435897435897 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06881720430107527 - nodes in this community are weakly interconnected._