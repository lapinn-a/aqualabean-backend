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
                Carts.findByPk(productId).then(cartProd => {
                    if (cartProd) {
                        //const newAmount = parseInt(amount) + parseInt(cartProd.amount);
                        Carts.update(req.body, {
                            where: {
                                userId: id,
                                productId: cartProd.productId,
                                amount: amount + cartProd.amount
                            }
                        }).then(cartProd => {
                            if (cartProd == 1) {
                                res.send({
                                    message: "Cart was updated successfully."
                                });
                            } else {
                                res.send({
                                    message: `Cannot update Cart`
                                });
                            }
                        }).catch(err => {
                            res.status(500).send({
                                message: "Error updating cart product"
                            });
                        });

                    } else {
                        let id = productId;
                        //Проверка на наличие количества товара
                        Products.findByPk(id).then(prod => {
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
                                                message:
                                                    err.message || "Cart add error"
                                            });
                                        });


                                } else {
                                    res.status(404).send({
                                        message: "Amount not available"
                                    });
                                }

                            } else {
                                res.status(404).send({
                                    message: "Product not found"
                                });
                            }

                        }).catch(err => {
                            res.status(500).send({
                                message: "Error when find product"
                            });
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Error when add product to cart"
                    });
                });

            }
                //Внизу код рабочий без проверки на повторы

                /*let id = productId;
                //Проверка на наличие количества товара
                Products.findByPk(id).then(prod => {
                    if(prod) {
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
                                        message:
                                            err.message || "Cart add error"
                                    });
                                });


                        }else {
                            res.status(404).send({
                                message: "Amount not available"
                            });
                        }

                    }
                    else {
                        res.status(404).send({
                            message: "Product not found"
                        });
                    }

                }).catch(err => {
                    res.status(500).send({
                        message: "Error when find product"
                    });
                });*/



             else {
                res.status(404).send({
                    message: "User not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error when adding to cart"
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
                            message: "Cart not found"
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Error get Cart"
                    });
                });

                // const prodIds = fav.rows;

            } else {
                res.status(404).send({
                    message: "User not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error when adding to favorites"
            });
        });
};


//Убрать из корзины товар
exports.delCart = (req, res) => {
    const id = req.userId;
    const pId = req.body.id;
    //const pAmount = req.body.amount;

    Users.findByPk(id)
        .then(user => {
            if(user) {
                Carts.destroy({
                    where: {
                        userId: id,
                        productId: pId,
                        //amount: pAmount
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Cart product was deleted successfully!"
                            });
                        } else {
                            res.send({
                                message: `Cannot delete product in Cart. Maybe product was not found!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Could not delete product in cart"
                        });
                    });

            } else {
                res.status(404).send({
                    message: "User not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error when delete product to cart"
            });
        });
};