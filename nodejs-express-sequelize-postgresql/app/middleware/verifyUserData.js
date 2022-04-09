const validator = require("email-validator")
const db = require("../models");
const ROLES = db.ROLES;
const users = db.users;

checkRequiredFieldsExists = (req, res, next) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Failed! Name not provided"
        });
        return;
    }

    if (!req.body.phone) {
        res.status(400).send({
            message: "Failed! Phone not provided"
        });
        return;
    }

    if (!req.body.email) {
        res.status(400).send({
            message: "Failed! Email not provided"
        });
        return;
    }

    if (!req.body.password) {
        res.status(400).send({
            message: "Failed! Password not provided"
        });
        return;
    }
    next();
}

checkDuplicatePhone = (req, res, next) => {
    users.findOne({
        where: {
            phone: req.body.phone
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Phone is already in use"
            });
            return;
        }
        next();
    });
};

checkDuplicateEmail = (req, res, next) => {
    users.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email is already in use"
            });
            return;
        }
        next();
    });
};

checkName = (req, res, next) => {
    if(req.body.name && req.body.name === '') {
        res.status(400).send({
            message: "Failed! Name cannot be empty"
        });
        return;
    }
    next();
};

checkRolesExisted = (req, res, next) => {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist"
                });
                return;
            }
        }
    }
    next();
};

checkPhone = (req, res, next) => {
    if (req.body.phone && req.body.phone.search(/\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/) !== 0) {
        res.status(400).send({
            message: "Failed! Phone format wrong"
        });
        return;
    }
    next();
};

checkEmail = (req, res, next) => {
    if (req.body.email && !validator.validate(req.body.email)) {
        res.status(400).send({
            message: "Failed! Email format wrong"
        });
        return;
    }
    next();
};

checkPassword = (req, res, next) => {
    const regExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
    if (req.body.password && !regExp.test(req.body.password)) {
        res.status(400).send({
            message: "Failed! Password format incorrect"
        });
        return;
    }
    next();
};

const verifyUserData = {
    checkRequiredFieldsExists: checkRequiredFieldsExists,
    checkDuplicatePhone: checkDuplicatePhone,
    checkDuplicateEmail: checkDuplicateEmail,
    checkName: checkName,
    checkRolesExisted: checkRolesExisted,
    checkPhone: checkPhone,
    checkEmail: checkEmail,
    checkPassword: checkPassword
};

module.exports = verifyUserData;