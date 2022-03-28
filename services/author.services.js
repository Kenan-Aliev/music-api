const { Author } = require("../models/index.js");
const ApiError = require("../utils/exceptions");
const Sequelize = require("sequelize");

class AuthorServices {
  async create(authorData) {
    const candidate = await Author.findOne({
      where: { name: { [Sequelize.Op.iLike]: authorData.name } },
    });
    if (candidate) {
      throw ApiError.ClientError("Такой исполнитель уже существует");
    }
    const author = await Author.create({ name: authorData.name });
    if (author.dataValues) {
      const authors = await Author.findAll();
      return { authors, message: "Вы успешно создали исполнителя" };
    }
    throw new Error("Произошла непредвиденная ошибка.Повторите попытку позже");
  }

  async getAll() {
    const authors = await Author.findAll();
    return authors;
  }
}

module.exports = new AuthorServices();
