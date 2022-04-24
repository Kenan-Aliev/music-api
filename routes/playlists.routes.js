const router = require("express").Router();
const roleMiddleware = require("../middlewares/role.middleware");
const playlistsController = require("../controllers/playlist.controllers");

router.get(
  "/getMyPlaylists",
  roleMiddleware(["user"]),
  playlistsController.getAllPlaylists
);

router.get(
  "/getPlayListTracks",
  roleMiddleware(["user"]),
  playlistsController.getPlaylistTracks
);

router.post(
  "/new",
  roleMiddleware(["user"]),
  playlistsController.createNewPlaylist
);

router.post('/addTrackToPlaylists',roleMiddleware(["user"]),)

router.delete(
  "/delete/:playlistId",
  roleMiddleware(["user"]),
  playlistsController.deleteUserPlaylist
);

module.exports = router;
