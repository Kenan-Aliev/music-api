const { Album } = require("../models/index");
const { Track } = require("../models/index");
const { Author } = require("../models/index");
const ApiError = require("../utils/exceptions");
const sequelize = require("sequelize");

class AlbumServices {
  async getAllAlbums() {
    const albums = await Album.findAll({
      attributes: [
        "id",
        "name",
        "year",
        [
          sequelize.literal(
            '(SELECT name FROM "authors" WHERE "albums"."authorId" = "authors"."id")'
          ),
          "author",
        ],
        [
          sequelize.literal(
            '(SELECT Count(*) FROM "tracks" WHERE "albums"."id" = "tracks"."albumId")'
          ),
          "tracksCount",
        ],
      ],
      include: {
        model: Track,
        attributes: ["id", "name"],
      },
    });
    return albums;
  }

  async addNewAlbum({ name, year, authorId, tracks }) {
    let isTrackInAlbum = false;
    let trackInAlbum = "";
    // проверка имени альбома у конкретного исполнителя на уникальность
    const candidate = await Album.findOne({
      where: { authorId, name },
    });
    if (candidate) {
      throw ApiError.ClientError(
        "У исполнителя уже существует альбом с таким названием"
      );
    }
    // проверка, не чужую ли песню мы добавляем в альбом
    const isForeignTrack = tracks.some((track) => track.author.id !== authorId);
    if (isForeignTrack) {
      throw ApiError.ClientError(
        "Вы не можете добавить в альбом исполнителя чужую песню"
      );
    }
    // проверка, есть ли песня уже в каком-то альбоме
    for (let t of tracks) {
      const track = await Track.findOne({ where: { id: t.id } });
      if (track.albumId) {
        isTrackInAlbum = true;
        trackInAlbum = track.name;
        break;
      }
    }
    if (isTrackInAlbum) {
      throw ApiError.ClientError(
        `Трек '${trackInAlbum}' уже входит в альбом. Вы не можете эту же песню добавить в другой альбом`
      );
    }
    // создаем альбом
    const res = await Album.create({ name, year, authorId });
    // обновляем поле альбома у треков
    for (let track of tracks) {
      await Track.update(
        {
          albumId: res.id,
        },
        {
          where: { id: track.id },
        }
      );
    }
    // получаем альбомы и возвращаем их
    const album = await this.getAlbumTracks(res.id);
    return album;
  }

  async getAlbumTracks(albumId) {
    const albumTracks = await Album.findOne({
      where: { id: albumId },
      attributes: [
        "id",
        "name",
        "year",
        [
          sequelize.literal(
            '(SELECT name FROM "authors" WHERE "albums"."authorId" = "authors"."id")'
          ),
          "author",
        ],
        [
          sequelize.literal(
            '(SELECT Count(*) FROM "tracks" WHERE "albums"."id" = "tracks"."albumId")'
          ),
          "tracksCount",
        ],
      ],
      include: {
        model: Track,
        attributes: ["id", "name"],
      },
    });
    return albumTracks;
  }

  async deleteTrack(albumId, trackId) {
    await Track.update({ albumId: null }, { where: { id: trackId } });
    const album = await this.getAlbumTracks(albumId);
    return album;
  }
}

module.exports = new AlbumServices();
