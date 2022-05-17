const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.roles;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.register = (req, res) => {
    // Save User to Database
    User.create({
        name: req.body.name,
        surname: req.body.surname,
        patronymic: req.body.patronymic,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        organization_id: req.body.organization_id
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "Пользователь успешно зарегистрирован!" });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([0]).then(() => {
                    res.send({ message: "Пользователь успешно зарегистрирован!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.login = (req, res) => {
    User.findOne({
        where: {
            phone: req.body.phone
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Пользователь не найден." });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Неверный пароль!"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    "greeting": "Добрый вечер, ",
                    name: user.name,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};