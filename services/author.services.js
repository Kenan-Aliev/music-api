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

  async delete(items) {
    for (let i = 0; i < items.length; i++) {
      await Author.destroy({ where: { id: items[i] } });
    }
    const authors = await Author.findAll();
    return { message: "Вы успешно удалили автора(ов)", authors };
  }
}

module.exports = new AuthorServices();
