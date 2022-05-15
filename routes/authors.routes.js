const router = require("express").Router();
const authorController = require("../controllers/author.controllers");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/getAll", authorController.getAll);
router.post("/create", roleMiddleware(["admin"]), authorController.create);
router.delete(
  "/delete/:items",
  roleMiddleware(["admin"]),
  authorController.delete
);
module.exports = router;
