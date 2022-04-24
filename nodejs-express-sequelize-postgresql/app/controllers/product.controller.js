const db = require("../models");
const fs = require('fs');
const Product = db.product;
const Op = db.Sequelize.Op;

// Создать и сохранить товар
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Name not specified!"
        });
        return;
    }

    if (req.body.price <= 0) {
        res.status(400).send({
            message: "Inappropriate price!"
        });
        return;
    }

    if (req.body.amount < 0) {
        res.status(400).send({
            message: "Inappropriate amount!"
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

// Получить адреса изображений
function getImages(id) {
    const server = 'https://aqualabean.ru/api/images/';

    return fs.promises.readdir('./images/' + id)
        .then(files => {
            return files.sort((a, b) => {
                return a.split('.')[0].localeCompare(b.split('.')[0], undefined, {
                    numeric: true,
                    sensitivity: 'base',
                    ignorePunctuation: true
                });
            }).map(file => server + id + '/' + file);
        })
        .catch(() => {
            return [];
        });
}

// deprecated
// Получить все товары
exports.findAll = async (req, res) => {
    console.warn("using deprecated function findAll");
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    const prod = await Product.findAll({ where: condition });
    //prod.forEach((data) => data.setDataValue("images",[]));

    prod.forEach((data) => {
        if(data) {
            const image = images[data.id - 1];
            if((data.id - 1) >= images.length) {
                data.setDataValue("images",[]);
            }
            else if(image){
                data.setDataValue("images",[image.url[0]])
            }
            //res.send(data);
        } else {
            res.status(404).send({
                message: "Product not found"
            });
        }
    });
    return res.json(prod);
};

// Получить товар по ID
exports.findOne = (req, res) => {
    const id = req.params.id;
    Promise.all([Product.findByPk(id), getImages(id)])
        .then(data => {
            if (data[0]) {
                data[0].setDataValue("images", data[1]);
                res.send(data[0]);
            } else {
                res.status(404).send({
                    message: "Product not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id = " + id
            });
        });
};

// Получить каталог товаров
exports.getCatalog = (req, res) => {
    const where = {};
    var limit;
    var offset;
    var order = [['id', 'ASC']];

    if (typeof req.query.limit != 'undefined' && typeof req.query.offset != 'undefined') {
        limit = req.query.limit;
        offset = req.query.offset;
    } else if (typeof req.query.page != 'undefined' && typeof req.query.size != 'undefined') {
        limit = req.query.size;
        offset = req.query.size * (req.query.page - 1);
    } else {
        res.status(400).send({
            message: "Error in query parameters"
        });
        return;
    }

    if (typeof req.query.sort != 'undefined' && typeof req.query.order != 'undefined') {
        if (req.query.order !== 'asc' && req.query.order !== 'desc') {
            res.status(400).send({
                message: "Error in query parameters"
            });
            return;
        }

        if (typeof Product.getAttributes()[req.query.sort] === 'undefined') {
            res.status(400).send({
                message: "Error in query parameters"
            });
            return;
        }
        order = [[req.query.sort, req.query.order]];
    }

    Product.findAndCountAll({where, limit, offset, order})
        .then(data => {
            const promises = [];
            data.rows.forEach((row) => {
                promises.push(getImages(row.id)
                    .then((images) => {
                        row.setDataValue("images", images);
                    })
                );
            });
            Promise.all(promises)
                .then(() => {
                    res.send(data);
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error while loading catalog"
            });
        });
};
