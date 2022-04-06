module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        /*code: {
            type: Sequelize.INTEGER
        },*/
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.DECIMAL(10, 2)
        },
        amount: {
            type: Sequelize.INTEGER
        },
    });

    return Product;
};