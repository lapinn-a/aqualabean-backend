module.exports = (sequelize, Sequelize) => {
    return sequelize.define("orderEntity", {
        orderId: {
            type: Sequelize.INTEGER
        },
        productId: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.DECIMAL(10, 2)
        },
        amount: {
            type: Sequelize.INTEGER
        }
    });
};