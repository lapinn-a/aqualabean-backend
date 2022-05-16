const db = require("../models");
const Favorites = db.favorites;
const Users = db.users;


//Добавить в избранное
exports.addFav = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;

    Users.findByPk(id)
        .then(user => {
            if(user) {
                const favProduct = {
                    userId: user.id,
                    productId: pId
                };

                Favorites.create(favProduct)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Ошибка добавления в избранное"
                        });
                    });

            } else {
                res.status(404).send({
                    message: "Пользователь не найден"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Ошибка при добавлении в избранное"
            });
        });

};

//Посмотреть избранное
exports.getFav = (req, res) => {
    const id = req.userId;

     Users.findByPk(id)
        .then(user => {
            if(user) {

                Favorites.findAndCountAll({
                    where: {
                        userId: user.id
                    }
                }).then(fav => {
                    if (fav) {
                        res.status(200).send(fav.rows);
                    } else {
                        res.status(404).send({
                            message: "Избранное не найдено"
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Ошибка получения избранного"
                    });
                });

               // const prodIds = fav.rows;

            } else {
                res.status(404).send({
                    message: "Пользователь не найден"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Ошибка при добавлении в избранное"
            });
        });
};


//Убрать из избранного
exports.delFav = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;

    Users.findByPk(id)
        .then(user => {
            if(user) {
                Favorites.destroy({
                    where: {
                        userId: id,
                        productId: pId
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Избранное успешно удалено!"
                            });
                        } else {
                            res.send({
                                message: `Невозможно удалить избранное. Возможно Избранное не найдено!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Не удалось удалить Избранное"
                        });
                    });

            } else {
                res.status(404).send({
                    message: "Пользователь не найден"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Ошибка при удалении из избранное"
            });
        });
};