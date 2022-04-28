const {auth} = require("../middleware");
const favorites = require("../controllers/favorites.controller");
module.exports = function(app) {
    //Добавить в избранное
    app.post("/api/fav/add", [auth.verifyToken], favorites.addFav);
    //Посмотреть избранное
    app.get("/api/fav/get", [auth.verifyToken], favorites.getFav);
    //Удалить из избранного
    app.delete("/api/fav/del", [auth.verifyToken], favorites.delFav);
};