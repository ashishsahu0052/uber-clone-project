const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.group("connect to db");
    })
    .catch((err) => console.log(err));
}

module.exports = connectToDb;
