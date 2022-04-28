const db = require("../models");
const Favorites = db.favorites;
const Products = db.favorites;
const Users = db.users;


//Добавить в избранное
exports.addFav = (req, res) => {
    const id = req.userId;
    const pId = req.headers["fav-product"];

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

                Favorites.findAndCountAll({
                    where: {
                        userId: user.id
                    }
                }).then(fav => {
                    if (fav) {
                        res.status(200).send(fav.rows);
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


//Убрать из избранного
exports.delFav = (req, res) => {
    const id = req.userId;
    const pId = req.headers["fav-product"];

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
                                message: `Cannot delete Favorite. Maybe Tutorial was not found!`
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
                message: "Error when adding to favorites"
            });
        });
};