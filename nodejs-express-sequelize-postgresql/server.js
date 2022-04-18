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
const Products = db.product;
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
  for (var i = 1; i <= 63; i++) {
    var price = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
    var amount = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
    var volumeAll = [0.33, 0.5, 0.75, 1.0, 1.5, 5.0, 19.0];
    var rand = Math.random()*volumeAll.length | 0;
    var volume = volumeAll[rand];
    var link = "https://aqualabean.ru/api/images/";
    if (i <= 10) {
      Products.create({
        name: "water_" + i,
        price: price / 100,
        amount: amount,
        volume: volume,
        image: link + i + "/water-"+ i + ".png"
      });
    } else {
      Products.create({
        name: "water_" + i,
        price: price / 100,
        amount: amount,
        volume: volume,
        image: "image not found"
      });
    }
  }
}

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to aqualabean application." });
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/catalog.routes")(app);


//Почему то не работает :(
// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/images', express.static('images'));


// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
