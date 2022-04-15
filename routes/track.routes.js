const router = require("express").Router();
const trackController = require("../controllers/track.controllers");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/getAll", trackController.getAll);
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

module.exports = router;
