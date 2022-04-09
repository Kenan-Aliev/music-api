const router = require("express").Router();
const roleMiddleware = require("../middlewares/role.middleware");
const genreController = require("../controllers/genre.controllers");

router.get("/getAll", roleMiddleware(["admin"]), genreController.getAll);
router.post("/create", roleMiddleware(["admin"]), genreController.create);
router.delete(
  "/delete/:items",
  roleMiddleware(["admin"]),
  genreController.delete
);

module.exports = router;
