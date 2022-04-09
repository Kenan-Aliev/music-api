const authorServices = require("../services/author.services");

class AuthorController {
  async create(req, res, next) {
    try {
      const response = await authorServices.create(req.body);
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const authors = await authorServices.getAll();
      return res.json({ message: "Вы успешно получили исполнителей", authors });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { items } = req.params;
      const response = await authorServices.delete(JSON.parse(items));
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthorController();
