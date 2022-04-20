const playlistServices = require("../services/playlist.services");

class PlaylistController {
  async getAllPlaylists(req, res, next) {
    try {
      const userId = req.user.userId;
      const response = await playlistServices.getAllPlaylists(userId);
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlaylistController();
