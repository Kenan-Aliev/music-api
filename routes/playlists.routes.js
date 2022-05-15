const router = require("express").Router();
const roleMiddleware = require("../middlewares/role.middleware");
const playlistsController = require("../controllers/playlist.controllers");

router.get(
  "/getMyPlaylists",
  roleMiddleware(["user"]),
  playlistsController.getAllPlaylists
);

router.get(
  "/getPlayListTracks/:playlistId",
  roleMiddleware(["user"]),
  playlistsController.getPlaylistTracks
);

router.get(
  "/getUsersPlaylists",
  // roleMiddleware(["admin"]),
  playlistsController.getUsersPlaylists
);

router.post(
  "/new",
  roleMiddleware(["user"]),
  playlistsController.createNewPlaylist
);

router.post(
  "/addTrackToPlaylists",
  roleMiddleware(["user"]),
  playlistsController.addNewTrackToPlaylists
);

router.delete(
  "/delete/:playlistId",
  roleMiddleware(["user"]),
  playlistsController.deletePlaylist
);

router.delete(
  "/deleteTrack/:playlistId/:trackId",
  roleMiddleware(["user"]),
  playlistsController.deleteTrackFromPlaylist
);

router.delete(
  "/deletePlaylist/:playlistId/:userId",
  roleMiddleware(["admin"]),
  playlistsController.deleteUserPlaylist
);

module.exports = router;
