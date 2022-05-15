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
      const album = await albumServices.addNewAlbum(req.body);
      return res.json({ message: "Вы успешно создали новый альбом", album });
    } catch (err) {
      next(err);
    }
  }
  async deleteTrack(req, res, next) {
    try {
      const { albumId, trackId } = req.params;
      const album = await albumServices.deleteTrack(albumId, trackId);
      return res.json({
        message: "Вы успешно удалили трек из альбома",
        album,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AlbumController();
