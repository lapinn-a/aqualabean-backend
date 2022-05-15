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
            if(user) {
                //Проверка на Повторное добавление товара
                Carts.findOne({ where: { productId: productId } }).then(cartProd => {
                    if (cartProd) {

                        let id = productId;
                        //Проверка на наличие количества товара
                        Products.findByPk(id).then(prod => {
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
                                    res.status(400).send({
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
                                            //res.send(data);
                                            getCart(req, res);
                                        })
                                        .catch(err => {
                                            /*res.status(500).send({
                                                message:
                                                    err.message || "Cart add error"
                                            });*/
                                            getCart(req, res);
                                        });


                                } else {
                                    res.status(400).send({
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
    return getCart(req, res);
}

function getCart(req, res) {
    const id = req.userId;

    Users.findByPk(id)
        .then(user => {
            if(user) {

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
                                    if(images.length > 1){
                                        images.length = 1;
                                    }
                                    row.setDataValue("images", images);
                                })
                            );
                            row.setDataValue("amount", row.carts.amount);
                            row.setDataValue("carts", undefined);
                        });
                        Promise.all(promises)
                            .then(() => {
                                res.send(cart.carts1);
                            });
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
                        /*if (num == 1) {
                            res.send({
                                message: "Cart product was deleted successfully!"
                            });
                        } else {
                            res.send({
                                message: `Cannot delete product in Cart. Maybe product was not found!`
                            });
                        }*/
                        getCart(req, res);
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
                                        /*if (cartProd == 1) {
                                            res.send({
                                                message: "Cart was updated successfully."
                                            });
                                        } else {
                                            res.send({
                                                message: `Cannot update Cart`
                                            });
                                        }*/
                                        getCart(req, res);
                                    }).catch(err => {
                                        res.status(500).send({
                                            message: "Error updating cart product"
                                        });
                                    });

                                } else {
                                    res.status(400).send({
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

                    } else {
                        res.send({
                            message: `Cannot update Cart, product not found`
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Error when update product to cart"
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
                message: "Error when update product to cart"
            });
        });
};
