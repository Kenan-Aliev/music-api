const genreService = require("../services/genre.services");

class GenreController {
  async create(req, res, next) {
    try {
      const response = await genreService.create(req.body);
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const genres = await genreService.getAll();
      return res.json({ message: "Вы успешно получили жанры", genres });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { items } = req.params;
      const response = await genreService.delete(JSON.parse(items));
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GenreController();
