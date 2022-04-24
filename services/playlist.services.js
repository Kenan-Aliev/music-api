const { PlayList } = require("../models/index");
const { Track } = require("../models/index");
const { Author } = require("../models/index");
const { Genre } = require("../models/index");
const { PLayLists_Tracks } = require("../models/index");
const ApiError = require("../utils/exceptions");

class PlaylistServices {
  async getAllPlaylists(userId) {
    const playlists = await this.getUserPlaylists(userId);
    return { message: "Вы успешно получили плейлисты", playlists };
  }

  async getPlaylistTracks(userId, playlistId) {
    const playlistTracks = await PlayList.findOne({
      where: { userId, id: playlistId },
      include: {
        model: Track,
        attributes: {
          exclude: ["authorId", "genreId"],
        },
        through: {
          attributes: [],
        },
        include: [
          {
            model: Author,
            attributes: ["name"],
          },
          {
            model: Genre,
            attributes: ["name"],
          },
        ],
      },
      attributes: [],
    });
    return {
      message: "Вы успешно получили песни из плейлиста",
      playlistTracks,
    };
  }

  async createNewPlaylist(userId, playlistName) {
    const candidate = await PlayList.findOne({
      where: { userId, playList_name: playlistName },
    });
    if (candidate) {
      throw ApiError.ClientError(
        `У пользователя уже существует плейлист с названием: ${playlistName}`
      );
    }
    await PlayList.create({ userId, playList_name: playlistName });
    const playlists = await this.getUserPlaylists(userId);
    return { message: "Вы успешно создали новый плейлист", playlists };
  }

  async getUserPlaylists(userId) {
    const playlists = await PlayList.findAll({ where: { userId } });
    return playlists;
  }

  async addNewTrackToPlaylists(playlists, trackId) {
    let trackIsHave = false;
    let playlistWithTrack = "";
    for (let playlist in playlists) {
      const candidate = await PLayLists_Tracks.findOne({
        where: { playlistId: playlist.id, trackId },
      });
      if (candidate) {
        trackIsHave = true;
        playlistWithTrack = playlist.playList_name;
        break;
      }
    }
    if (trackIsHave) {
      throw ApiError.ClientError(
        `Данный трек уже существует в плейлисте: ${playlistWithTrack}. Поробуйте заново добавить трек в плейлисты`
      );
    }
    playlists.forEach(async (playlist) => {
      await PLayLists_Tracks.create({ playlistId: playlist.id, trackId });
    });

    return { message: "Вы успешно добавили трек в плейлисты" };
  }

  async deleteUserPlaylist(userId, playlistId) {
    await PlayList.destroy({ where: { userId, id: playlistId } });
    const playlists = await this.getUserPlaylists(userId);
    return { message: "Вы успешно удалили плейлист", playlists };
  }
}

module.exports = new PlaylistServices();
