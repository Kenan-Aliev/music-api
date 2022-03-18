const { Genre } = require("../models/index.js");
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
      return "Вы успешно создали новый жанр";
    }
    throw new Error("Что-то пошло не так");
  }

  async getAll() {
    const genres = await Genre.findAll();
    return genres;
  }
}

module.exports = new GenreServices();
