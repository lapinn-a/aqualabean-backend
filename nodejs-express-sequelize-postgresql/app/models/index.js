const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);
db.roles = require("./role.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.favorites = require("./favorites.model")(sequelize, Sequelize);
db.carts = require("./carts.model")(sequelize, Sequelize);
db.orders = require("./order.model")(sequelize, Sequelize);
db.orderEntity = require("./orderEntity.model")(sequelize, Sequelize);

db.roles.belongsToMany(db.users, {
    through: "user_roles", //название соед таблиц
    foreignKey: "roleId",   //
    otherKey: "userId"      //
});
db.users.belongsToMany(db.roles, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});
//Для избранного
db.users.belongsToMany(db.product, {
    as: "favorites1",
    through: "favorites",
    foreignKey: "userId",
    otherKey: "productId"
});
db.product.belongsToMany(db.users, {
    as: "favorites1",
    through: "favorites",
    foreignKey: "productId",
    otherKey: "userId"
});
//Для корзины
db.users.belongsToMany(db.product, {
    as: "carts1",
    through: "carts",
    foreignKey: "userId",
    otherKey: "productId"
});
db.product.belongsToMany(db.users, {
    as: "carts1",
    through: "carts",
    foreignKey: "productId",
    otherKey: "userId"
});
//Для заказов
db.users.hasMany(db.orders, {
    foreignKey: "userId"
});
db.orders.belongsTo(db.users);
db.orders.hasMany(db.orderEntity, {
    foreignKey: "orderId"
});
db.orderEntity.belongsTo(db.orders);

db.ROLES = ["user"];

module.exports = db;