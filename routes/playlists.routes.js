const router = require("express").Router();
const roleMiddleware = require("../middlewares/role.middleware");
const playlistsController = require("../controllers/playlist.controllers");

router.get(
  "/getMyPlaylists",
  roleMiddleware(["user"]),
  playlistsController.getAllPlaylists
);

module.exports = router;
