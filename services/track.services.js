const { Op } = require("sequelize");
const { Track } = require("../models/index.js");
const ApiError = require("../utils/exceptions");
const { Author } = require("../models/index.js");
const { Genre } = require("../models/index.js");
const { UserTrackList } = require("../models/index");

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
    const newTrack = await this.getTrack(track.id);
    return { message: "Вы успешно добавили новую песню", newTrack };
  }

  async search(filters) {
    for (let filter in filters) {
      if (!filters[filter]) {
        delete filters[filter];
      } else if (
        filters[filter] &&
        typeof filters[filter] === "string" &&
        isNaN(Number(filters[filter]))
      ) {
        filters[filter] = {
          [Op.iLike]: "%" + filters[filter] + "%",
        };
      } else if (filters[filter] && !isNaN(Number(filters[filter]))) {
        filters[filter] = Number(filters[filter]);
      }
    }
    let tracks = await Track.findAll({
      where: {
        ...filters,
      },
      include: [
        {
          model: Author,
          attributes: ["id", "name"],
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

  async getAll() {
    const tracks = await this.getAllTracks();
    return tracks;
  }

  async addMusicToTrackList(userId, trackId) {
    const userTrackList = await UserTrackList.findOne({ where: { userId } });
    const trackListTracks = await userTrackList.getTracks();
    let candidate = trackListTracks.find((track) => track.id === trackId);
    if (candidate) {
      throw ApiError.ClientError("Такой трек в вашем списке уже существует");
    }
    const track = await Track.findOne({ where: { id: trackId } });
    const newTrack = await userTrackList.addTrack(track);
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
    const track = await Track.findOne({ where: { id: trackId } });
    await trackList.removeTrack(track);
    const userTracks = await this.getUserTracks(userId);
    return {
      message: "Вы успешно удалили трек из вашего списка",
      tracks: userTracks.tracks,
    };
  }

  async getTrack(trackId) {
    const track = await Track.findOne({
      where: { id: trackId },
      include: [
        {
          model: Author,
          attributes: ["id", "name"],
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
    return track;
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
          attributes: ["id", "name"],
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
