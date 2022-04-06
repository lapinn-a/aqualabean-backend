const { auth } = require("../middleware");
const controller = require("../controllers/users.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/test/all", controller.allAccess);
    app.get(
        "/api/test/user",
        [auth.verifyToken],
        controller.userBoard
    );
    /*app.get(
        "/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );
    app.get(
        "/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );*/
};