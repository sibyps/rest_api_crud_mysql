const router = require("express").Router()
const { register, getAll, getOne, update, deleteEmployee } = require("../controllers/employeeController")
const { regValidate ,validate} = require("../middlewares/formValidation")
const { verifyJwt } = require("../middlewares/verfiy_jwt")


 
router.post("/add-employee",verifyJwt,regValidate,validate,register)

router.get("/get-all-employees",verifyJwt,getAll)

router.get("/get-one-employee/:id",verifyJwt,getOne)

router.patch("/update-employee/:id",verifyJwt,update)

router.delete("/delete-employee/:id",verifyJwt,deleteEmployee)

module.exports = router