const db = require("../models");
const Users = db.users;
const Products = db.product;
const Orders = db.orders;
const OrderEntity = db.orderEntity;

// Оформить заказ
exports.createOrder = (req, res) => {
    Users.findOne({
        where: {
            id: req.userId
        },
        include: {
            model: Products,
            as: 'carts1',
            through: { attributes: ['amount'] }
        }
    }).then(products => {
        //res.send(products.carts1);
        if(products) {
            if(products.length === 0){
                res.status(400).send({
                    message: "Невозможно оформить заказ, так как в корзине нет товаров"
                });
            }
            products.carts1.forEach(product => {
                if (product.carts.amount > product.amount) {
                    res.status(400).send({
                        message: "Товара " + product.name + " недостаточно на складе"
                    });
                }
            });

            const order = {
                //code: req.body.code,
                userId: req.userId,
                deliveryAddress: req.body.deliveryAddress,
                deliveryPrice: 300
            };

            // Сохранить в БД
            Orders.create(order)
                .then(data => {
                    if (data) {
                        var itemsProcessed = 0;
                        products.carts1.forEach(product => {
                            const orderEntity = {
                                orderId: data.id,
                                userId: req.userId,
                                productId: product.id,
                                name: product.name,
                                amount: product.carts.amount,
                                price: product.price
                            };

                            OrderEntity.create(orderEntity)
                                .then(() => {
                                    Products.increment('amount', {
                                        by: -product.carts.amount,
                                        where: {
                                            id: product.id
                                        }
                                    });
                                    itemsProcessed++;
                                    if(itemsProcessed === products.carts1.length){
                                        req.query.id = data.id;
                                        getOrder(req, res);
                                    }
                                })
                                .catch(err => {
                                    console.log(err.message);
                                    res.status(500).send({
                                        message: "Произошла ошибка при оформлении заказа"
                                    });
                                });
                        });
                    } else {
                        res.status(500).send({
                            message: "Произошла ошибка при оформлении заказа"
                        });
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    res.status(500).send({
                        message: "Произошла ошибка при оформлении заказа"
                    });
                });
        } else {
            res.status(500).send({
                message: "Произошла ошибка при оформлении заказа."
            });
        }
    });
}

// Посмотреть заказы
exports.getOrders = (req, res) => {
    Orders.findAll({
        where: {
            userId: req.userId
        },
        include: {
            model: OrderEntity,
            //as: 'products',
            //through: { attributes: ['amount'] }
        }
    }).then(orders => {
        if(orders){
            orders.forEach(order => {
                var total = order.deliveryPrice;
                order.orderEntities.forEach(product => {
                    total += product.price * product.amount;
                });
                order.setDataValue("price", Math.round(total * 100) / 100);
            });
            res.send(orders);
        } else {
            res.status(500).send({
                message: "Произошла ошибка при получении заказов"
            });
        }
        /*products.carts1.forEach(product => {
            if(product.carts.amount > product.amount){
                res.status(400).send({
                    message: "Товара " + product.name + " недостаточно на складе!"
                });
            }
        });*/
    });
}

// Посмотреть заказ
exports.getOrder = (req, res) => {
    return getOrder(req, res);
}

function getOrder(req, res){
    console.log(req.userId);
    Orders.findOne({
        where: {
            userId: req.userId,
            id: req.query.id
        },
        include: {
            model: OrderEntity,
            //as: 'products',
            //through: { attributes: ['amount'] }
        }
    }).then(order => {
        if(order){
            var total = order.deliveryPrice;
            order.orderEntities.forEach(product => {
                total += product.price * product.amount;
            });
            order.setDataValue("price", Math.round(total * 100) / 100);
            res.send(order);
        } else {
            res.status(404).send({
                message: "Заказ не найден"
            });
        }
    });
}