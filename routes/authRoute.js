
const router = require("express").Router()
const { login, logout, refreshToken } = require("../controllers/authController")
const {validate, logValidate } = require("../middlewares/formValidation")


 
router.post("/admin-login",logValidate,validate,login)
router.post("/refresh-token",refreshToken)
router.delete("/logout",logout) 
 

module.exports =router