const {auth} = require("../middleware");
const favorites = require("../controllers/favorites.controller");
module.exports = function(app) {
    //Добавить в избранное
    app.put("/api/favorites", [auth.verifyToken], favorites.addFav);
    //Посмотреть избранное
    app.get("/api/favorites", [auth.verifyToken], favorites.getFav);
    //Удалить из избранного
    app.delete("/api/favorites", [auth.verifyToken], favorites.delFav);
};
