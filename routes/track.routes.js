const router = require("express").Router();
const trackController = require("../controllers/track.controllers");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/getAll", roleMiddleware(["user"]), trackController.getAll);
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

module.exports = router;
