const products = require("../controllers/product.controller");
module.exports = app => {
    const products = require("../controllers/product.controller");

    var router = require("express").Router();

    // Создать товар
    router.post("/add", products.create);

    // Получить все товары
    router.get("/all", products.findAll);

    // Получить товар по ID
    router.get("/:id", products.findOne);


    app.use("/api/product", router);
};