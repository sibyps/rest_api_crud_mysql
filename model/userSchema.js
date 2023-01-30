
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      name: {
        type: DataTypes.STRING,
        allowsNull: false,
      },
      email:{
        type:DataTypes.STRING,
        allowsNull:false,
      },
      password:{
        type:DataTypes.STRING,
        allowsNull:false,
      }
    });
    return User;
  };
  