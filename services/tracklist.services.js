const { UserTrackList } = require("../models/index");

class TrackListServices {
  async create(userId) {
    const trackList = await UserTrackList.create({ userId });
    return trackList;
  }
}

module.exports = new TrackListServices();
