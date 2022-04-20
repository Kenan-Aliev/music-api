const { Author } = require("../models/index.js");
const { Track } = require("../models/index");
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
    let tracksIsHave = false;
    for (let item of items) {
      const track = await Track.findOne({ where: { authorId: item } });
      if (track) {
        tracksIsHave = true;
        break;
      }
    }

    if (tracksIsHave) {
      throw ApiError.ClientError(
        "У автора(ов),которого(ых) вы хотите удалить уже имеются песни, поэтому вы не можете его(их) удалить"
      );
    }

    for (let item of items) {
      await Author.destroy({ where: { id: item } });
    }

    const authors = await Author.findAll();
    return { message: "Вы успешно удалили автора(ов)", authors };
  }
}

module.exports = new AuthorServices();
