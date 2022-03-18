const trackService = require("../services/track.services");

class TrackController {
  async create(req, res, next) {
    try {
      const trackData = req.body;
      const track = await trackService.create(trackData);
      return res.json(track);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const tracks = await trackService.getAll();
      return res.json(tracks);
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
      const tracks = await trackService.getMyTracks(userId);
      return res.json(tracks)
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TrackController();
