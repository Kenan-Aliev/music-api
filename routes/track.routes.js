const router = require("express").Router();
const trackController = require("../controllers/track.controllers");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/getAll", trackController.getAll);
router.get("/search", trackController.search);
router.post("/create", roleMiddleware(["admin"]), trackController.create);
router.post(
  "/addToTrackList",
  roleMiddleware(["user"]),
  trackController.addMusicToTrackList
);
router.get(
  "/getMyTracks",
  roleMiddleware(["user"]),
  trackController.getMyTracks
);

router.delete(
  "/delete/:tracks",
  roleMiddleware(["admin"]),
  trackController.deleteTracks
);

router.delete(
  "/deleteTrackFromTrackList/:trackId",
  roleMiddleware(["user"]),
  trackController.deleteTrackFromTrackList
);
// router.delete('/deleteFromTrackList/:trackId',roleMiddleware(["user"]),trac)

module.exports = router;
