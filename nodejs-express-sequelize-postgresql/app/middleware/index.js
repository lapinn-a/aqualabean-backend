const auth = require("./auth");
const verifyRegister = require("./verifyUserData");
module.exports = {
    auth,
    verifyUserData: verifyRegister
};