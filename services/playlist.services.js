const { PlayList } = require("../models/index");

class PlaylistServices {
  async getAllPlaylists(userId) {
    const playlists = await PlayList.findAll({ where: { userId } });
    return { message: "Вы успешно получили плейлисты", playlists };
  }
}

module.exports = new PlaylistServices();
