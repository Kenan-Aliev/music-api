const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { registerValidators } = require("../utils/registrationValidator");

router.post("/registration", registerValidators, authController.registration);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
module.exports = router;
