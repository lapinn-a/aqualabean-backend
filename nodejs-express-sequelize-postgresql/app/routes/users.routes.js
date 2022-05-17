const { auth, verifyUserData } = require("../middleware");
const controller = require("../controllers/users.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
        "/api/account",
        [auth.verifyToken],
        controller.userBoard
    );
    app.put(
        "/api/account",
        [
            auth.verifyToken,
            verifyUserData.checkDuplicateEmail,
            verifyUserData.checkDuplicatePhone,
            verifyUserData.checkName,
            verifyUserData.checkPhone,
            verifyUserData.checkEmail,
            verifyUserData.checkPassword
        ],
        controller.updateData
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
