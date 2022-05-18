const db = require("../models");
const Favorites = db.favorites;
const Users = db.users;
const Products = db.product;
const productsController = require("../controllers/product.controller");

//Добавить в избранное
exports.addFav = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;

    Users.findByPk(id)
        .then(user => {
            if (user) {
                const favProduct = {
                    userId: user.id,
                    productId: pId
                };

                Favorites.create(favProduct)
                    .then(() => {
                        //res.send(data);
                        getFav(req, res);
                    })
                    .catch(err => {
                        console.log(err.message);
                        getFav(req, res);
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
                message: "Не удалось добавить товар в избранное"
            });
        });

};

//Посмотреть избранное
exports.getFav = (req, res) => {
    return getFav(req, res);
}

function getFav(req, res) {
    const id = req.userId;

    Users.findByPk(id)
        .then(user => {
            if (user) {

                Users.findOne({
                    where: {
                        id: user.id
                    },
                    include: {
                        model: Products,
                        as: 'favorites1',
                        through: { attributes: [] }
                    }
                }).then(fav => {
                    if (fav) {
                        const promises = [];
                        fav.favorites1.forEach((row) => {
                            promises.push(productsController.getImages(row.id)
                                .then((images) => {
                                    if (images.length > 1) {
                                        images.length = 1;
                                    }
                                    row.setDataValue("images", images);
                                })
                            );
                        });
                        Promise.all(promises)
                            .then(() => {
                                res.send(fav.favorites1);
                            });
                    } else {
                        res.status(404).send({
                            message: "Избранное не найдено"
                        });
                    }
                }).catch(err => {
                    console.log(err.message);
                    res.status(500).send({
                        message: "Не удалось получить избранное"
                    });
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
                message: "Не удалось получить избранное"
            });
        });
}


//Убрать из избранного
exports.delFav = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;

    Users.findByPk(id)
        .then(user => {
            if (user) {
                Favorites.destroy({
                    where: {
                        userId: id,
                        productId: pId
                    }
                })
                    .then(() => {
                        getFav(req, res);
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(500).send({
                            message: "Не удалось удалить товар из избранного"
                        });
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
                message: "Не удалось удалить товар из избранного"
            });
        });
};
