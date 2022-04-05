const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

Error.stackTraceLimit = 50;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Roles = db.roles;
//db.sequelize.sync();
 // drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

function initial() {
  Roles.create({
    id: 0,
    name: "user"
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to aqualabean application." });
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/product.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
