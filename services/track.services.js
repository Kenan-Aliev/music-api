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
    return track;
  }

  async getAll() {
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

  async addMusicToTrackList(userId, trackId) {
    const userTrackList = await UserTrackList.findOne({ userId });
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
      return "Вы успешно добавили новый трек в список вашей музыки";
    }
    throw new Error("Что-то пошло не так");
  }

  async getMyTracks(userId) {
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
}

module.exports = new TrackService();
