const router = require("express").Router();
const roleMiddleware = require("../middlewares/role.middleware");
const albumControllers = require("../controllers/albums.controllers");

router.get("/getAll", roleMiddleware(["admin"]), albumControllers.getAllAlbums);
router.post("/new", roleMiddleware(["admin"]), albumControllers.addNewAlbum);
router.delete(
  "/delete/:albumId/:trackId",
  roleMiddleware(["admin"]),
  albumControllers.deleteTrack
);
module.exports = router;
