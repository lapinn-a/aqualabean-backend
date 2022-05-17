const validator = require("email-validator")
const db = require("../models");
const ROLES = db.ROLES;
const users = db.users;

checkRequiredFieldsExists = (req, res, next) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Ошибка! Имя не указано"
        });
        return;
    }

    if (!req.body.phone) {
        res.status(400).send({
            message: "Ошибка! Телефон не указан"
        });
        return;
    }

    if (!req.body.email) {
        res.status(400).send({
            message: "Ошибка! Электронная почта не указана"
        });
        return;
    }

    if (!req.body.password) {
        res.status(400).send({
            message: "Ошибка! Пароль не указан"
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
                message: "Ошибка! Телефон уже используется"
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
                message: "Ошибка! Почтовый ящик уже используется"
            });
            return;
        }
        next();
    });
};

checkName = (req, res, next) => {
    if(req.body.name && req.body.name === '') {
        res.status(400).send({
            message: "Ошибка! Имя не может быть пустым"
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
                    message: "Ошибка! Роль не существует"
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
            message: "Ошибка! Неверный формат телефона"
        });
        return;
    }
    next();
};

checkEmail = (req, res, next) => {
    if (req.body.email && !validator.validate(req.body.email)) {
        res.status(400).send({
            message: "Ошибка! Неверный формат электронной почты"
        });
        return;
    }
    next();
};

checkPassword = (req, res, next) => {
    const regExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
    if (req.body.password && !regExp.test(req.body.password)) {
        res.status(400).send({
            message: "Ошибка! Неверный формат пароля"
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