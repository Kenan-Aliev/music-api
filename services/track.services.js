const { Track } = require("../models/index.js");
const ApiError = require("../utils/exceptions");
const { Author } = require("../models/index.js");
const { Genre } = require("../models/index.js");
const { UserTrackList } = require("../models/index");
const { UserTrackList_Tracks } = require("../models/index");

class TrackService {
  async create(trackData) {
    const candidate = await Track.findOne({
      where: { name: trackData.name, authorId: trackData.authorId },
    });
    if (candidate) {
      throw ApiError.ClientError("У исполнителя такая песня уже существует");
    }
    const track = await Track.create({
      name: trackData.name,
      authorId: trackData.authorId,
      genreId: trackData.genreId,
    });
    if (!track) {
      throw new Error("Что-то пошло не так");
    }
    const tracks = await this.getAllTracks();
    return { message: "Вы успешно добавили новую песню", tracks };
  }

  async getAll() {
    const tracks = await this.getAllTracks();
    return tracks;
  }

  async addMusicToTrackList(userId, trackId) {
    const userTrackList = await UserTrackList.findOne({ where: { userId } });
    const candidate = await UserTrackList_Tracks.findOne({
      where: { trackListId: userTrackList.id, trackId },
    });

    if (candidate) {
      throw ApiError.ClientError("Такой трек в вашем списке уже существует");
    }
    const newTrack = await UserTrackList_Tracks.create({
      trackListId: userTrackList.id,
      trackId,
    });
    if (newTrack) {
      return {
        message: "Вы успешно добавили новый трек в список вашей музыки",
      };
    }
    throw new Error("Что-то пошло не так");
  }

  async getMyTracks(userId) {
    const tracks = await this.getUserTracks(userId);
    return { message: "Вы успешно получили ваши треки", tracks: tracks.tracks };
  }

  async delete(items) {
    for (let i = 0; i < items.length; i++) {
      await Track.destroy({ where: { id: items[i] } });
    }
    const tracks = await this.getAllTracks();
    return { message: "Вы успешно удалили трек(и)", tracks };
  }

  async deleteTrackFromTrackList(userId, trackId) {
    const trackList = await UserTrackList.findOne({ where: { userId } });
    await UserTrackList_Tracks.destroy({
      where: { trackListId: trackList.id, trackId },
    });
    const userTracks = await this.getUserTracks(userId);
    return {
      message: "Вы успешно удалили трек из вашего списка",
      tracks: userTracks.tracks,
    };
  }

  async getUserTracks(userId) {
    const tracks = await UserTrackList.findOne({
      where: { userId },
      include: {
        model: Track,
        as: "tracks",
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
      attributes: {
        exclude: ["id", "userId"],
      },
    });

    return tracks;
  }

  async getAllTracks() {
    const tracks = await Track.findAll({
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
      attributes: {
        exclude: ["genreId", "authorId"],
      },
    });
    return tracks;
  }
}

module.exports = new TrackService();
