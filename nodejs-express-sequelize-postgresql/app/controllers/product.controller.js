const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;

// Создать и сохранить товар
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Создать товар
    const product = {
        //code: req.body.code,
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount
    };

    // Сохранить в БД
    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        });
};

// Получить все товары
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Product.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving products."
            });
        });
};

// Получить товар по ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with code=" + id
            });
        });
};

exports.getCatalog = (req, res) => {
    const where = {};
    var limit;
    var offset;

    if (typeof req.query.limit != 'undefined' && typeof req.query.offset != 'undefined') {
        limit = +req.query.limit;
        offset = +req.query.offset;
    } else if (typeof req.query.page != 'undefined' && typeof req.query.size != 'undefined') {
        limit = req.query.size;
        offset = req.query.size * (req.query.page - 1);
    } else {
        res.status(400).send({
            message: "Error in query parameters"
        });
        return;
    }

    Product.findAndCountAll({where, limit, offset})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error while loading catalog"
            });
        });
};


