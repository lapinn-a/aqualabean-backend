const db = require("../models");
const productsController = require("./product.controller");
const Carts = db.carts;
const Users = db.users;
const Products = db.product;


//Добавить в корзину
exports.addCart = (req, res) => {
    //const id = req.userId;
    let id = req.userId;
    const productId = req.body.id;
    const amount = req.body.amount;

    Users.findByPk(id)
        .then(user => {
            if (user) {
                //Проверка на Повторное добавление товара
                Carts.findOne({ where: { userId: user.id, productId: productId } }).then(cartProd => {
                    if (cartProd) {
                        //Проверка на наличие количества товара
                        Products.findByPk(productId).then(prod => {
                            if (prod) {
                                if ((parseInt(amount) + parseInt(cartProd.amount)) <= prod.amount) {
                                    //Добавляем к текущему количеству
                                    // Carts.update(req.body, {
                                    Carts.update({ amount: (parseInt(amount) + parseInt(cartProd.amount)) }, {
                                        where: {
                                            userId: user.id,
                                            productId: cartProd.productId
                                        }
                                    }).then(cartProd => {
                                        if (parseInt(cartProd) === 1) {
                                            getCart(req, res);
                                        } else {
                                            res.send({
                                                message: "Не удалось добавить товар в корзину"
                                            });
                                        }
                                    }).catch(err => {
                                        console.log(err.message);
                                        res.status(500).send({
                                            message: "Не удалось добавить товар в корзину"
                                        });
                                    });
                                } else {
                                    res.status(400).send({
                                        message: "Количество недоступно"
                                    });
                                }
                            } else {
                                res.status(404).send({
                                    message: "Товар не найден"
                                });
                            }

                        }).catch(err => {
                            console.log(err.message);
                            res.status(500).send({
                                message: "Не удалось добавить товар в корзину"
                            });
                        });
                    } else {
                        //Проверка на наличие количества товара
                        Products.findByPk(productId).then(prod => {
                            if (prod) {
                                if (amount <= prod.amount) {

                                    const product = {
                                        userId: user.id,
                                        productId: productId,
                                        amount: amount
                                    };

                                    Carts.create(product)
                                        .then(() => {
                                            getCart(req, res);
                                        })
                                        .catch(err => {
                                            console.log(err.message);
                                            getCart(req, res);
                                        });
                                } else {
                                    res.status(400).send({
                                        message: "Количество недоступно"
                                    });
                                }
                            } else {
                                res.status(404).send({
                                    message: "Товар не найден"
                                });
                            }
                        }).catch(err => {
                            console.log(err.message);
                            res.status(500).send({
                                message: "Не удалось добавить товар в корзину"
                            });
                        });
                    }
                }).catch(err => {
                    console.log(err.message);
                    res.status(500).send({
                        message: "Не удалось добавить товар в корзину"
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
                message: "Не удалось добавить товар в корзину"
            });
        });

};

//Посмотреть корзину
exports.getCart = (req, res) => {
    return getCart(req, res);
}

function getCart(req, res) {
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
                        as: 'carts1',
                        through: { attributes: ['amount'] }
                    }
                }).then(cart => {
                    if (cart) {
                        const promises = [];
                        cart.carts1.forEach((row) => {
                            promises.push(productsController.getImages(row.id)
                                .then((images) => {
                                    if (images.length > 1) {
                                        images.length = 1;
                                    }
                                    row.setDataValue("images", images);
                                })
                            );
                            row.setDataValue("cartAmount", row.carts.amount);
                            row.setDataValue("carts", undefined);
                        });
                        Promise.all(promises)
                            .then(() => {
                                res.send(cart.carts1);
                            });
                    } else {
                        res.status(404).send({
                            message: "Не удалось получить корзину"
                        });
                    }
                }).catch(err => {
                    console.log(err.message);
                    res.status(500).send({
                        message: "Не удалось получить корзину"
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
            console.log(err.message);
            res.status(500).send({
                message: "Не удалось получить корзину"
            });
        });
}


//Убрать из корзины товар
exports.delCart = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;

    const where = {
        userId: id,
    }

    if(pId){
        where.productId = pId;
    }

    Users.findByPk(id)
        .then(user => {
            if (user) {
                Carts.destroy({
                    where: where
                })
                    .then(() => {
                        /*if (num == 1) {
                            res.send({
                                message: "Товар успешно удалён из корзины!"
                            });
                        } else {
                            res.send({
                                message: "Невозможно удалить товар из корзины, в корзине его нет"
                            });
                        }*/
                        getCart(req, res);
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(500).send({
                            message: "Не удалось удалить товар из корзины"
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
                message: "Не удалось удалить товар из корзины"
            });
        });
};


//Обновить количество
exports.updateCart = (req, res) => {
    let id = req.userId;
    const productId = req.body.productId;
    const amount = req.body.amount;

    Users.findByPk(id)
        .then(user => {
            if (user) {
                Carts.findOne({ where: { productId: productId } }).then(cartProd => {
                    if (cartProd) {
                        //Проверка на наличие количества товара
                        Products.findByPk(productId).then(prod => {
                            if (prod) {
                                if (amount <= prod.amount) {
                                    if(req.body.amount > 0) {
                                        Carts.update(req.body, {
                                            where: {
                                                userId: user.id,
                                                productId: cartProd.productId
                                            }
                                        }).then(() => {
                                            getCart(req, res);
                                        }).catch(err => {
                                            console.log(err.message);
                                            res.status(500).send({
                                                message: "Не удалось обновить количество"
                                            });
                                        });
                                    } else {
                                        Carts.destroy({
                                            where: {
                                                userId: user.id,
                                                productId: cartProd.productId
                                            }
                                        }).then(() => {
                                            getCart(req, res);
                                        }).catch(err => {
                                            console.log(err.message);
                                            res.status(500).send({
                                                message: "Не удалось обновить количество"
                                            });
                                        });
                                    }

                                } else {
                                    res.status(400).send({
                                        message: "Количество недоступно"
                                    });
                                }

                            } else {
                                res.status(404).send({
                                    message: "Товар не найден"
                                });
                            }

                        }).catch(err => {
                            console.log(err.message);
                            res.status(500).send({
                                message: "Не удалось обновить количество"
                            });
                        });

                    } else {
                        res.send({
                            message: "Не удалось обновить количество, товара нет в корзине"
                        });
                    }
                }).catch(err => {
                    console.log(err.message);
                    res.status(500).send({
                        message: "Не удалось обновить количество"
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
                message: "Не удалось обновить количество"
            });
        });
};
