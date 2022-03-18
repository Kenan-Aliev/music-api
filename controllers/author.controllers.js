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
      return res.json(authors);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthorController();
