const db = require("../models");
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
    res.status(200).send("User Content.");
};

exports.updateData = (req, res) => {
    const { name, surname, patronymic, phones, email, password, organization_id } = req.body;
    if (name === "") return res.status(400).send({ message: "`name` must not be an empty string"});
    else if (surname === "") return res.status(400).send({ message: "`surname` must not be an empty string"});
    else if (patronymic === "") return res.status(400).send({ message: "`patronymic` must not be an empty string"});
    else if (phones === "") return res.status(400).send({ message: "`phone` must not be an empty string"});
    else if (email === "") return res.status(400).send({ message: "`email` must not be an empty string"});
    else if (password === "") return res.status(400).send({ message: "`password` must not be an empty string"});
    else if (organization_id === "") return res.status(400).send({ message: "`organization_id` must not be an empty string"});

    else {
        const phone = req.params.phone;
        Users.update(req.body, {
            where: {
                phone: req.body.phone
            }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "User data was updated successfully."
                    });
                } else {
                    res.status(200).send({
                        message: `Cannot update user data with phone=${phone}. Maybe user data was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating user with phone=" + phone
                });
            });

    }
};