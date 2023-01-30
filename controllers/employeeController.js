const createError = require("http-errors");
const db = require("../model");
const User = db.user;
const bcrypt = require("bcrypt");

//creating employees
module.exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    //check if the user already exists or not
    const isExists = await User.findOne({ where: { email: email } });
    if (isExists) throw createError.Conflict("This email already in use");

    //hash the password
    const hash = await bcrypt.hash(password, 12);

    //create a new user
    const employee = await User.create({
      name,
      email,
      password: hash,
    });

    res.status(200).json({ success: true, message: "successfully created" });
  } catch (error) {
    next(error);
  }
};


//get all

module.exports.getAll = async (req, res, next) => {
  try {
    const allEmployee = await User.findAll({});
    res.status(200).json({ success: true, allEmployee });
  } catch (error) {
    next(error);
  }
};

//get one

module.exports.getOne = async (req, res, next) => {
  try {
    let id = req.params.id;
    let employee = await User.findOne({ where: { id: id } });
    if (!employee) throw createError.NotFound("No employee found");

    res.status(200).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

//update
module.exports.update = async (req, res, next) => {
  try {
    let id = req.params.id;
    let oneemployee = await User.findOne({ where: { id: id } });
    if (!oneemployee) throw createError.NotFound("No employee found");

    let info = {
        name: req.body.name,
      };
      const employee = await User.update(info, { where: { id: id } });
    res.status(200).json({ message: "updated successfully", employee });
  } catch (error) {
    next(error);
  }
};
//delete
module.exports.deleteEmployee = async (req, res, next) => {
  try {
    let id = req.params.id;
    let oneemployee = await User.findOne({ where: { id: id } });
    if (!oneemployee) throw createError.NotFound("No employee found");

    const employee = await User.destroy({ where: { id: id } })

    res.status(200).json({ success: true, message: "successfully deleted" });
  } catch (error) {
    next(error);
  }
};
