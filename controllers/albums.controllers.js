const albumServices = require("../services/albums.services");

class AlbumController {
  async getAllAlbums(req, res, next) {
    try {
      const albums = await albumServices.getAllAlbums();
      return res.json({ message: "Вы успешно получили все альбомы", albums });
    } catch (err) {
      next(err);
    }
  }

  async addNewAlbum(req, res, next) {
    try {
      const albums = await albumServices.addNewAlbum(req.body);
      return res.json({ message: "Вы успешно создали новый альбом", albums });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AlbumController();
