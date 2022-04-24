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

  async createNewPlaylist(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.userId;
      const response = await playlistServices.createNewPlaylist(userId, name);
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async addNewTrackToPlaylists(req, res, next) {
    try {
      const { playlists, trackId } = req.body;
      const response = await playlistServices.addNewTrackToPlaylists(
        playlists,
        trackId
      );
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteUserPlaylist(req, res, next) {
    try {
      const userId = req.user.userId;
      const { playlistId } = req.params;
      const response = await playlistServices.deleteUserPlaylist(
        userId,
        Number(playlistId)
      );
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getPlaylistTracks(req, res, next) {
    try {
      const { playlistId } = req.params;
      const userId = req.user.userId;
      const response = await playlistServices.getPlaylistTracks(
        userId,
        playlistId
      );
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlaylistController();
