const { verifyRegister } = require("../middleware");
const controller = require("../controllers/auth.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/register",
        [
            verifyRegister.checkDuplicate,
            verifyRegister.checkName,
            verifyRegister.checkRolesExisted,
            verifyRegister.checkPhone,
            verifyRegister.checkEmail,
            verifyRegister.checkPassword
        ],
        controller.register
    );
    app.post("/api/auth/login", controller.login);
    app.put("/api/update", controller.updateData);
};
