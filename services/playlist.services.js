const { PlayList } = require("../models/index");
const { Track } = require("../models/index");
const { Author } = require("../models/index");
const { Genre } = require("../models/index");
const { User } = require("../models/index");
const sequelize = require("sequelize");
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

  async getUsersPlaylists() {
    const usersPlaylists = await User.findAll({
      where: { role: "user" },
      attributes: [
        "id",
        "username",
        "email",
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "playlists" WHERE "playlists"."userId" = "users"."id")'
          ),
          "playlistsCount",
        ],
      ],
      include: {
        model: PlayList,
        as: "playlists",
        attributes: [
          "id",
          "playList_name",
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM "playlists_tracks" WHERE "playlists"."id" = "playlists_tracks"."playlistId")'
            ),
            "tracksCount",
          ],
        ],
      },
    });
    return usersPlaylists;
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

  async getUserPlaylists(userId, userDataIncluded = false) {
    let userPlaylists;
    if (!userDataIncluded) {
      userPlaylists = await PlayList.findAll({ where: { userId } });
    } else {
      userPlaylists = await User.findOne({
        where: { id: userId },
        attributes: [
          "id",
          "username",
          "email",
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM "playlists" WHERE "playlists"."userId" = "users"."id")'
            ),
            "playlistsCount",
          ],
        ],
        include: {
          model: PlayList,
          as: "playlists",
          attributes: [
            "id",
            "playList_name",
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM "playlists_tracks" WHERE "playlists"."id" = "playlists_tracks"."playlistId")'
              ),
              "tracksCount",
            ],
          ],
        },
      });
    }
    return userPlaylists;
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
    let playlistWithTrack = "";
    let trackIsHave = false;
    for (let pl of playlists) {
      const playlist = await PlayList.findOne({ where: { id: pl.id } });
      const playlistTracks = await playlist.getTracks();
      const candidate = playlistTracks.find((track) => track.id === trackId);
      if (candidate) {
        playlistWithTrack = pl.playList_name;
        trackIsHave = true;
        break;
      }
    }
    if (trackIsHave) {
      throw ApiError.ClientError(
        `Данный трек уже существует в плейлисте: ${playlistWithTrack}. Попробуйте заново добавить трек в плейлист(ы)`
      );
    }
    const track = await Track.findOne({ where: { id: trackId } });
    playlists.forEach(async (pl) => {
      const playlist = await PlayList.findOne({
        where: {
          id: pl.id,
        },
      });
      await playlist.addTrack(track);
    });

    return { message: "Вы успешно добавили трек в плейлист(ы)" };
  }

  async deletePlaylist(userId, playlistId, role) {
    await PlayList.destroy({ where: { userId, id: playlistId } });
    let user_playlists;
    if (role === "user") {
      user_playlists = await this.getUserPlaylists(userId);
    } else if (role === "admin") {
      user_playlists = await this.getUserPlaylists(userId, true);
    }
    return user_playlists;
  }

  async deleteTrackFromPlaylist(playlistId, trackId, userId) {
    const playlist = await PlayList.findOne({
      where: { id: playlistId, userId },
    });
    const playlistTracks = await playlist.getTracks();
    for (let track of playlistTracks) {
      if (track.id === trackId) {
        await playlist.removeTrack(track);
      }
    }
    const tracks = await this.getPLTracks(userId, playlistId);
    return {
      message: "Вы успешно удалили трек из плейлиста",
      tracks: tracks.tracks,
    };
  }
}

module.exports = new PlaylistServices();
