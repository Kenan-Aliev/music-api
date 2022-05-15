const trackService = require("../services/track.services");

class TrackController {
  async create(req, res, next) {
    try {
      const trackData = req.body;
      const response = await trackService.create(trackData);
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const tracks = await trackService.getAll();
      return res.json({ message: "Вы успешно получили все песни", tracks });
    } catch (err) {
      next(err);
    }
  }

  async search(req, res, next) {
    try {
      const tracks = await trackService.search(req.query);
      return res.json({ message: "Вы успешно получили треки", tracks });
    } catch (err) {
      next(err);
    }
  }

  async addMusicToTrackList(req, res, next) {
    try {
      const userId = req.user.userId;
      const trackId = req.body.trackId;
      const result = await trackService.addMusicToTrackList(userId, trackId);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMyTracks(req, res, next) {
    try {
      const userId = req.user.userId;
      const response = await trackService.getMyTracks(userId);
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteTracks(req, res, next) {
    try {
      const { tracks } = req.params;
      const response = await trackService.delete(JSON.parse(tracks));
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteTrackFromTrackList(req, res, next) {
    try {
      const { trackId } = req.params;
      const userId = req.user.userId;
      const response = await trackService.deleteTrackFromTrackList(
        userId,
        trackId
      );
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TrackController();
