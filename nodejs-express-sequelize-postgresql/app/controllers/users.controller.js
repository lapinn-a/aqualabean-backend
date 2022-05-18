const db = require("../models");
const bcrypt = require("bcryptjs");
const Users = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
//exports.create = (req, res) => {
    // Validate request
    /*  if (!req.body.title) {
          res.status(400).send({
              message: "Content can not be empty!"
          });
          return;
      }*/

    // Create a Tutorial
 /*   const users = {
        name: req.body.name,
        surname: req.body.surname,
        patronymic: req.body.patronymic,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        organization_id: req.body.organization_id

        /*title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false*/
    //};

    // Save Tutorial in the database
    /*Users.create(users)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });*/
//};

/*

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Tutorial.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};
*/
// Find a single Tutorial with an id
/*exports.findOne = (req, res) => {
    const id = req.params.id;

    Users.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id
            });
        });
};*/
/*
// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
    Tutorial.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};
 */
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    return userBoard (req, res); 
}

function userBoard (req, res) {
    const id = req.userId;

    Users.findByPk(id)
        .then(user => {
            if(user) {
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
            res.status(500).send({
                message: "Не удалось получить профиль пользователя"
            });
        });
};

exports.updateData = (req, res) => {
    if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    Users.update(req.body, {
        where: {
            id: req.userId
        }
    })
        .then(num => {
            if (num == 1) {
                //res.send({
                    //message: "Данные успешно обновлены!"
                    
                //});
                userBoard (req, res);
            } else {
                res.status(400).send({
                    message: "Не удалось обновить данные пользователя. Возможно, пользователь не найден, или запрос на обновление пуст"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Не удалось обновить данные пользователя."
            });
        });
};
