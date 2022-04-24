const { PlayList } = require("../models/index");
const { Track } = require("../models/index");
const { Author } = require("../models/index");
const { Genre } = require("../models/index");
const { PlayLists_Tracks } = require("../models/index");
const ApiError = require("../utils/exceptions");

class PlaylistServices {
  async getAllPlaylists(userId) {
    const playlists = await this.getUserPlaylists(userId);
    return { message: "Вы успешно получили плейлисты", playlists };
  }

  async getPlaylistTracks(userId, playlistId) {
    const playlistTracks = await this.getPLTracks(userId, playlistId);
    return {
      message: "Вы успешно получили песни из плейлиста",
      tracks: playlistTracks.tracks,
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

  async getPLTracks(userId, playlistId) {
    const tracks = await PlayList.findOne({
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
    return tracks;
  }

  async addNewTrackToPlaylists(playlists, trackId) {
    let trackIsHave = false;
    let playlistWithTrack = "";
    for (let playlist of playlists) {
      console.log(playlist);
      const candidate = await PlayLists_Tracks.findOne({
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
        `Данный трек уже существует в плейлисте: ${playlistWithTrack}. Поробуйте заново добавить трек в плейлист(ы)`
      );
    }
    playlists.forEach(async (playlist) => {
      await PlayLists_Tracks.create({ playlistId: playlist.id, trackId });
    });

    return { message: "Вы успешно добавили трек в плейлист(ы)" };
  }

  async deleteUserPlaylist(userId, playlistId) {
    await PlayList.destroy({ where: { userId, id: playlistId } });
    const playlists = await this.getUserPlaylists(userId);
    return { message: "Вы успешно удалили плейлист", playlists };
  }

  async deleteTrackFromPlaylist(playlistId, trackId, userId) {
    await PlayLists_Tracks.destroy({ where: { playlistId, trackId } });
    const tracks = await this.getPLTracks(userId, playlistId);
    return {
      message: "Вы успешно удалили трек из плейлиста",
      tracks: tracks.tracks,
    };
  }
}

module.exports = new PlaylistServices();
