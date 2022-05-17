const db = require("../models");
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
            if(user) {
                //Проверка на Повторное добавление товара
                Carts.findOne({ where: { productId: productId } }).then(cartProd => {
                    if (cartProd) {
                        //Проверка на наличие количества товара
                        Products.findByPk(productId).then(prod => {
                            if (prod) {
                                if ((parseInt(amount) + parseInt(cartProd.amount)) <= prod.amount) {
                                    //Добавляем к текущему количеству
                                   // Carts.update(req.body, {
                                    Carts.update({ amount : (parseInt(amount) + parseInt(cartProd.amount)) }, {
                                        where: {
                                            userId: user.id,
                                            productId: cartProd.productId
                                        }
                                    }).then(cartProd => {
                                        if (cartProd == 1) {
                                            res.send({
                                                message: "Товар добавлен в корзину!"
                                            });
                                        } else {
                                            res.send({
                                                message: "Не удалось добавить товар в корзину"
                                            });
                                        }
                                    }).catch(err => {
                                        res.status(500).send({
                                            message: "Не удалось добавить товар в корзину"
                                        });
                                    });
                                } else {
                                    res.status(404).send({
                                        message: "Количество недоступно"
                                    });
                                }
                            } else {
                                res.status(404).send({
                                    message: "Товар не найден"
                                });
                            }

                        }).catch(err => {
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
                                        .then(data => {
                                            res.send(data);
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                message: "Не удалось добавить товар в корзину"
                                            });
                                        });
                                } else {
                                    res.status(404).send({
                                        message: "Количество недоступно"
                                    });
                                }
                            } else {
                                res.status(404).send({
                                    message: "Товар не найден"
                                });
                            }
                        }).catch(err => {
                            res.status(500).send({
                                message: "Не удалось добавить товар в корзину"
                            });
                        });
                    }
                }).catch(err => {
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
            res.status(500).send({
                message: "Не удалось добавить товар в корзину"
            });
        });

};

//Посмотреть корзину
exports.getCart = (req, res) => {
    const id = req.userId;

    Users.findByPk(id)
        .then(user => {
            if(user) {

                Carts.findAndCountAll({
                    where: {
                        userId: user.id
                    }
                }).then(cart => {
                    if (cart) {
                        res.status(200).send(cart.rows);
                    } else {
                        res.status(404).send({
                            message: "Не удалось получить корзину"
                        });
                    }
                }).catch(err => {
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
            res.status(500).send({
                message: "Не удалось получить корзину"
            });
        });
};


//Убрать из корзины товар
exports.delCart = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;

    Users.findByPk(id)
        .then(user => {
            if(user) {
                Carts.destroy({
                    where: {
                        userId: id,
                        productId: pId,
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Товар успешно удалён из корзины!"
                            });
                        } else {
                            res.send({
                                message: "Невозможно удалить товар из корзины, в корзине его нет"
                            });
                        }
                    })
                    .catch(err => {
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
            if(user) {
                Carts.findOne({ where: { productId: productId } }).then(cartProd => {
                    if (cartProd) {
                        let id = productId;
                        //Проверка на наличие количества товара
                        Products.findByPk(id).then(prod => {
                            if (prod) {
                                if (amount <= prod.amount) {
                                    Carts.update(req.body, {
                                        where: {
                                            userId: user.id,
                                            productId: cartProd.productId
                                        }
                                    }).then(cartProd => {
                                        if (cartProd == 1) {
                                            res.send({
                                                message: "Количество успешно обновлено!"
                                            });
                                        } else {
                                            res.send({
                                                message: "Не удалось обновить количество"
                                            });
                                        }
                                    }).catch(err => {
                                        res.status(500).send({
                                            message: "Не удалось обновить количество"
                                        });
                                    });

                                } else {
                                    res.status(404).send({
                                        message: "Количество недоступно"
                                    });
                                }

                            } else {
                                res.status(404).send({
                                    message: "Товар не найден"
                                });
                            }

                        }).catch(err => {
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
            res.status(500).send({
                message: "Не удалось обновить количество"
            });
        });
};