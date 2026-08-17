const http = require("http");
const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { log } = require("console");

const server = http.createServer(app);
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`server is runnig on potrt ${port}`);
});
