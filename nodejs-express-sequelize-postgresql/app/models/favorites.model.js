module.exports = (sequelize, Sequelize) => {
    const Favorites = sequelize.define("favorites", {
        userId: {
            type: Sequelize.INTEGER
        },
        productId: {
            type: Sequelize.INTEGER
        },
    });

    return Favorites;
};