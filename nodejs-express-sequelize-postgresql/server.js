const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

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

// Set port and sync database
var PORT;
if (process.env.NODE_ENV !== 'test') {
    PORT = process.env.PORT || 8000;
    db.sequelize.sync();
} else {
    PORT = 0;
    console.log("Drop and re-sync db.");
    db.sequelize.sync({ force: true }).then(() => {
        initial();
    });
}

/*db.sequelize.sync({ force: true }).then(() => {
    initial();
});*/

function initial() {
    Roles.create({
        id: 0,
        name: "user"
    });

    var max;
    if (process.env.NODE_ENV !== 'test') {
        max = 1003;
    } else {
        max = 13;
    }

    for (var i = 1; i <= max; i++) {
        var price = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
        var amount = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
        var volumeAll = [0.33, 0.5, 0.75, 1.0, 1.5, 5.0, 19.0];
        var randV = Math.random() * volumeAll.length | 0;
        var volume = volumeAll[randV];
        var ingredientsALl = ["Доочищенная вода централизованного источника водоснабжения",
            "Гидрокарбонаты 2500-3000, сульфаты <25, хлориды 450-550, натрий + калий 1200-1450, кальций < 25, магний <25.Допускается естественный осадок минеральных солей",
            "Минерализация: 5,0 – 7,5 г/л. Основной состав, мг/л: кальций 20 – 150, магний 20 – 150, натрий 1000 – 2000, гидрокарбонаты 3500 – 5000, хлориды 250 – 500.",
            "Гидрокарбонаты 250-450, кальций 50-80, магний 15-40",
            "подготовленная артезианская вода",
            "Минерализация: 0,05 – 1,0 г/л. Основной состав мг/л: кальций 0,5 – 130, магний 0,5 – 50, натрий 0,2 – 100, калий 0,1 – 20, гидрокарбонаты 5 – 350, хлориды 0,5 – 200, сульфаты 0,5 – 200. Общая жесткость <7 мг-экв/л",
            "Кальций 70-90, магний 20-40,натрий+калий менее 15, сульфаты менее 15, хлориды менее 15, гидрокарбонаты 320-370, нитраты менее 5, диоксид кремния 9-17, pH 7-8.Допускается естественный осадок минеральных солей",
            "Гидрокарбонаты 150-250, кальций 25-50, натрий+калий 5-30, магний 5-20",
            "HCO 50 - 200мг/л, Ca менее 50мг/л, Mg - менее 20мг/л, Na - K - менее 40мг/л.",
            "Кальций 94, магний 20, натрий 7,7, калий 5, гидрокарбонаты 248, сульфаты 120, хлориды 4, NO3<0.5"
        ];
        var randIng = Math.random() * ingredientsALl.length | 0;
        var ingredients = ingredientsALl[randIng];
        var MadeManufacturerAll = [{ made: "Россия, г. Москва", manufacturer: "Шишкин лес", name: ["Шишкин лес"] },
            { made: "Россия, г. Тула", manufacturer: "IDS Borjomi Russia", name: ["Borjomi"] },
            { made: "Россия, Московская область", manufacturer: "Бобимэкс", name: ["Снежская"] },
            { made: "Россия, г. Екатеренбург", manufacturer: "Меркурий", name: ["Пилигрим", "Архызская", "Меркурий", "Кубай"] },
            { made: "Россия, г. Самара", manufacturer: "PepsiСo", name: ["Aqua Minerale", "Родники России", "Ессентуки"] },
            { made: "Россия, г. Санкт-Петербург", manufacturer: "Аквалайф", name: ["Аквалайф", "Черноголовка", "Славяновская"] },
            { made: "Франция, г. Эвьян-ле-Бен", manufacturer: "Danone", name: ["Evian"] },
            { made: "Россия, г. Черкесск", manufacturer: "Архыз Оригинал", name: ["Архыз"] }
        ];
        /*var mineralization = ["", "", " минеральная"];
        var natural = ["", "", " природная"];
        var drinking = ["", " питьевая"];
        var medical = ["", "", " лечебно-столовая", " лечебная"];
        var carbonated = ["", " негазированная", " газированная"];
        var children = ["", "", " для детского питания"];*/
        var randM = Math.random() * MadeManufacturerAll.length | 0;
        var made = MadeManufacturerAll[randM].made;
        var manufacturer = MadeManufacturerAll[randM].manufacturer;
        var name = /*"Вода "*/"";
        name += MadeManufacturerAll[randM].name[Math.random() * MadeManufacturerAll[randM].name.length | 0];
        /*name += mineralization[Math.random() * mineralization.length | 0];
        name += natural[Math.random() * natural.length | 0];
        name += drinking[Math.random() * drinking.length | 0];
        name += medical[Math.random() * medical.length | 0];
        name += carbonated[Math.random() * carbonated.length | 0];
        name += children[Math.random() * children.length | 0];*/
        var info = [" минеральная", " природная", " питьевая", " лечебно-столовая", " лечебная", " негазированная", " газированная", " для детского питания"];
        name += info[Math.random() * info.length | 0];
        name += " " + volume.toString().replace(".", ",") + " л";
        Products.create({
            name: name,
            price: price / 100,
            amount: amount,
            volume: volume,
            ingredients: ingredients,
            made: made,
            manufacturer: manufacturer
        });
    }
}

// simple route
app.get("/api", (req, res) => {
    res.json({ message: "Добро пожаловать в приложение Aqualabean!" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/catalog.routes")(app);
require("./app/routes/favorites.routes")(app);
require("./app/routes/carts.routes")(app);
require("./app/routes/order.routes")(app);

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/api/images', express.static('images'));

// Listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
