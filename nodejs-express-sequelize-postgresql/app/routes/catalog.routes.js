const products = require("../controllers/product.controller");
module.exports = app => {
    const products = require("../controllers/product.controller");

    var router = require("express").Router();

    router.get("/", products.getCatalog);

    app.use("/api/catalog", router);
};