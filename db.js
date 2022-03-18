const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  database: "rkp-2-laba",
  username: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
