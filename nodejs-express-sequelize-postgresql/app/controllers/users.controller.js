const db = require("../models");
const bcrypt = require("bcryptjs");
const Users = db.users;

exports.userBoard = (req, res) => {
    const id = req.userId;

    Users.findByPk(id)
        .then(user => {
            if (user) {
                res.status(200).send({
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    patronymic: user.patronymic,
                    phone: user.phone,
                    email: user.email,
                    organization_id: user.organization_id
                });
            } else {
                res.status(404).send({
                    message: "Пользователь не найден"
                });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({
                message: "Не удалось получить профиль пользователя"
            });
        });
};

exports.updateData = (req, res) => {
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    Users.update(req.body, {
        where: {
            id: req.userId
        }
    })
        .then(num => {
            if (parseInt(num) === 1) {
                res.send({
                    message: "Данные успешно обновлены!"
                });
            } else {
                res.status(400).send({
                    message: "Не удалось обновить данные пользователя. Возможно, пользователь не найден, или запрос на обновление пуст"
                });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({
                message: "Не удалось обновить данные пользователя."
            });
        });
};