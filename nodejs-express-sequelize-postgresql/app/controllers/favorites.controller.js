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
                                err.message || "Favorite add error"
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
                message: "Error when adding to favorites"
            });
        });

};

//Посмотреть избранное
exports.getFav = (req, res) => {
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
                        as: 'favorites1',
                        through: { attributes: [] }
                    }
                }).then(fav => {
                    if (fav) {
                        const promises = [];
                        fav.favorites1.forEach((row) => {
                            promises.push(productsController.getImages(row.id)
                                .then((images) => {
                                    if(images.length > 1){
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
                            message: "Favorites not found"
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Error get Favorites"
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
                message: "Error when adding to favorites"
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
                                message: "Favorite was deleted successfully!"
                            });
                        } else {
                            res.send({
                                message: `Cannot delete Favorite. Maybe Favorite was not found!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Could not delete Favorite"
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
                message: "Error when del to favorites"
            });
        });
};