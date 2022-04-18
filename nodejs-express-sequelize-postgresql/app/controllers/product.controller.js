const db = require("../models");
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
//Images URLs
var images = [
    { id: 1, url: ["https://aqualabean.ru/api/images/1/water-1.png","https://aqualabean.ru/api/images/2/water-2.png"]},
    { id: 2, url: "https://aqualabean.ru/api/images/2/water-2.png"},
    { id: 3, url: "https://aqualabean.ru/api/images/3/water-3.png"},
    { id: 4, url: "https://aqualabean.ru/api/images/4/water-4.png"},
    { id: 5, url: "https://aqualabean.ru/api/images/5/water-5.png"},
    { id: 6, url: "https://aqualabean.ru/api/images/6/water-6.png"},
    { id: 7, url: "https://aqualabean.ru/api/images/7/water-7.png"},
    { id: 8, url: "https://aqualabean.ru/api/images/8/water-8.png"},
    { id: 9, url: "https://aqualabean.ru/api/images/9/water-9.png"},
    { id: 10, url: "https://aqualabean.ru/api/images/10/water-10.png"}
]

//Реализация сканирования файлов не работает!, так как проблемы get запросами файлов на localhost
/*var fs = require('fs');
var files = fs.readdirSync('/images');*/

// Получить все товары
exports.findAll = async (req, res) => {
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
                data.setDataValue("images",image.url)
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
    const image = images[id-1];
    Product.findByPk(id)
        .then(data => {
            if(data) {
                if((id-1) >= images.length) {
                    res.status(200).send({
                        id: data.id,
                        name: data.name,
                        price: data.price,
                        amount: data.amount,
                        volume: data.volume,
                        images: []
                    });
                }
                else if(image){
                    res.status(200).send({
                        id: data.id,
                        name: data.name,
                        price: data.price,
                        amount: data.amount,
                        volume: data.volume,
                        images: image.url
                    });
                }
                //res.send(data);
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
exports.getCatalog = async (req, res) => {
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
    
    if(typeof req.query.sort != 'undefined' && typeof req.query.order != 'undefined'){
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

    /*Product.findAndCountAll({where, limit, offset, order})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error while loading catalog"
            });
        });*/

    const { count, rows } = await Product.findAndCountAll({where, limit, offset, order});
    rows.forEach((data) => {
        if(data) {
            const image = images[data.id - 1];
            if((data.id - 1) >= images.length) {
                data.setDataValue("images",[]);
            }
            else if(image){
                data.setDataValue("images",image.url)
            }
            //res.send(data);
        } else {
            res.status(404).send({
                message: "Product not found"
            });
        }
    });
    return res.json(rows);
};
