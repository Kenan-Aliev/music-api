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

  async getUsersPlaylists(req, res, next) {
    try {
      const response = await playlistServices.getUsersPlaylists();
      return res.json({
        message: "Вы успешно получили пользователей и их плейлисты",
        users_playlists: response,
      });
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

  async deletePlaylist(req, res, next) {
    try {
      const userId = req.user.userId;
      const { playlistId } = req.params;
      const playlists = await playlistServices.deletePlaylist(
        userId,
        Number(playlistId),
        "user"
      );
      return res.json({ message: "Вы успешно удалили плейлист", playlists });
    } catch (err) {
      next(err);
    }
  }

  async deleteTrackFromPlaylist(req, res, next) {
    try {
      const { playlistId, trackId } = req.params;
      const userId = req.user.userId;
      const response = await playlistServices.deleteTrackFromPlaylist(
        Number(playlistId),
        Number(trackId),
        userId
      );
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteUserPlaylist(req, res, next) {
    try {
      const { userId, playlistId } = req.params;
      const user_playlists = await playlistServices.deletePlaylist(
        userId,
        playlistId,
        "admin"
      );
      return res.json({
        message: "Вы успешно удалили плейлист пользователя",
        user_playlists,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlaylistController();
