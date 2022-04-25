module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.DECIMAL(10, 2)
        },
        amount: {
            type: Sequelize.INTEGER
        },
        volume: {
            type: Sequelize.DECIMAL(4, 2)
        },
        ingredients: {
            type: Sequelize.STRING
        },
        made: {
            type: Sequelize.STRING
        },
        manufacturer: {
            type: Sequelize.STRING
        },
    });

    return Product;
};