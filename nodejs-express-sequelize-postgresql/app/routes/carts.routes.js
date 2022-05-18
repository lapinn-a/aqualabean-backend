const { auth } = require("../middleware");
const carts = require("../controllers/carts.controller");
module.exports = function(app) {
    //Добавить в корзину
    app.post("/api/cart", [auth.verifyToken], carts.addCart);
    //Посмотреть корзину
    app.get("/api/cart", [auth.verifyToken], carts.getCart);
    //Удалить из корзины
    app.delete("/api/cart", [auth.verifyToken], carts.delCart);
    //Обновить количество
    app.put("/api/cart", [auth.verifyToken], carts.updateCart);
};