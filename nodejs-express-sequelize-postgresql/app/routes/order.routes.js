const { auth } = require("../middleware");
const orders = require("../controllers/order.controller");
module.exports = function(app) {
    // Оформить заказ
    app.post("/api/orders", [auth.verifyToken], orders.createOrder);
    // Посмотреть заказы
    app.get("/api/orders", [auth.verifyToken], orders.getOrders);
    // Посмотреть заказ
    app.get("/api/order", [auth.verifyToken], orders.getOrder);
    /*//Удалить из корзины
    app.delete("/api/cart", [auth.verifyToken], carts.delCart);
    //Обновить количество
    app.put("/api/cart", [auth.verifyToken], carts.updateCart);*/
};