module.exports = (sequelize, Sequelize) => {
    return sequelize.define("order", {
        userId: {
            type: Sequelize.INTEGER
        },
        deliveryAddress: {
            type: Sequelize.STRING
        },
        deliveryPrice: {
            type: Sequelize.INTEGER
        },
    });
};