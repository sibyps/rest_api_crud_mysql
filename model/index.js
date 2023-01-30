const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: process.env.DIALECT,
    host: process.env.HOST,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => console.log("error", error));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userSchema")(sequelize, DataTypes);


db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done");
});

module.exports = db;
