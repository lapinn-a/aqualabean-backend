const db = require("../models");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const Product = db.product;
const Users = db.users;
const Op = db.Sequelize.Op;

// Создать и сохранить товар
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Имя не указано!"
        });
        return;
    }

    if (req.body.price <= 0) {
        res.status(400).send({
            message: "Несоответствующая цена!"
        });
        return;
    }

    if (req.body.amount < 0) {
        res.status(400).send({
            message: "Несоответствующее количество!"
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
                    "Произошла ошибка при добавлении товара"
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

// Получить параметр для объединения
function getInclude(token){
    const include = {
        model: Users,
        as: 'favorites1',
        required: false,
        through: {attributes: []},
        where: {id: 0}
    };
    if(token){
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return;
            }
            include.where.id = decoded.id;
        });
    }
    return include;
}

// Получить товар по ID
exports.findOne = (req, res) => {
    const id = req.query.id;
    const token = req.headers["x-access-token"];
    const include = getInclude(token);
    Promise.all([Product.findByPk(id, {include: include}), getImages(id)])
        .then(data => {
            if (data[0]) {
                data[0].setDataValue("images", data[1]);
                data[0].setDataValue("favorite", data[0].favorites1.length === 1);
                data[0].setDataValue("favorites1", undefined);
                res.send(data[0]);
            } else {
                res.status(404).send({
                    message: "Товар не найден"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Ошибка получения товара с номером " + id
            });
        });
};

// Получить каталог товаров
exports.getCatalog = (req, res) => {
    const where = {};
    var limit;
    var offset;
    var order = [['id', 'ASC']];
    const token = req.headers["x-access-token"];
    const include = getInclude(token);

    if (typeof req.query.limit != 'undefined' && typeof req.query.offset != 'undefined') {
        limit = req.query.limit;
        offset = req.query.offset;
    } else if (typeof req.query.page != 'undefined' && typeof req.query.size != 'undefined') {
        limit = req.query.size;
        offset = req.query.size * (req.query.page - 1);
    } else {
        res.status(400).send({
            message: "Ошибка в параметрах запроса"
        });
        return;
    }

    if (typeof req.query.sort != 'undefined' && typeof req.query.order != 'undefined') {
        if (req.query.order !== 'asc' && req.query.order !== 'desc') {
            res.status(400).send({
                message: "Ошибка в параметрах запроса"
            });
            return;
        }

        if (typeof Product.getAttributes()[req.query.sort] === 'undefined') {
            res.status(400).send({
                message: "Ошибка в параметрах запроса"
            });
            return;
        }
        order = [[req.query.sort, req.query.order]];
    }

    var parameters = {where, limit, offset, order, include};

    for(const filter in req.query){
        if(req.query.hasOwnProperty(filter) && typeof Product.getAttributes()[filter] !== 'undefined'){
            parameters.where[filter] = {
                [Op.iLike]: `%${req.query[filter]}%`
            }
        }
    }

    Product.findAndCountAll(parameters)
        .then(data => {
            const promises = [];
            data.rows.forEach((row) => {
                promises.push(getImages(row.id)
                    .then((images) => {
                        if(images.length > 1){
                            images.length = 1;
                        }
                        row.setDataValue("images", images);
                    })
                );
                row.setDataValue("favorite", row.favorites1.length === 1);
                row.setDataValue("favorites1", undefined);
            });
            Promise.all(promises)
                .then(() => {
                    res.send(data);
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Не удалось получить каталог"
            });
        });
};

exports.getImages = (id) => {
    return getImages(id);
}