const { Genre } = require("../models/index.js");
const { Track } = require("../models/index");
const ApiError = require("../utils/exceptions");
const Sequelize = require("sequelize");

class GenreServices {
  async create(genreData) {
    const candidate = await Genre.findOne({
      where: { name: { [Sequelize.Op.iLike]: genreData.name } },
    });
    if (candidate) {
      throw ApiError.ClientError("Такой жанр уже существует");
    }
    const genre = await Genre.create({ name: genreData.name });
    if (genre.dataValues) {
      const genres = await Genre.findAll();
      return { genres, message: "Вы успешно создали новый жанр" };
    }
    throw new Error("Что-то пошло не так");
  }

  async getAll() {
    const genres = await Genre.findAll();
    return genres;
  }

  async delete(items) {
    let tracksIsHave = false;
    for (let item of items) {
      const track = await Track.findOne({ where: { genreId: item } });
      if (track) {
        tracksIsHave = true;
        break;
      }
    }

    if (tracksIsHave) {
      throw ApiError.ClientError(
        "У жанра(ов),которого(ых) вы хотите удалить уже имеются песни, поэтому вы не можете его(их) удалить"
      );
    }

    for (let item of items) {
      await Genre.destroy({ where: { id: item } });
    }

    const genres = await Genre.findAll();
    return { message: "Вы успешно удалили жанр(ы)", genres };
  }
}

module.exports = new GenreServices();
