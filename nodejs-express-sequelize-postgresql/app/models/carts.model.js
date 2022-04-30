module.exports = (sequelize, Sequelize) => {
    const Carts = sequelize.define("carts", {
        userId: {
            type: Sequelize.INTEGER
        },
        productId: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.INTEGER
        },
    });

    return Carts;
};