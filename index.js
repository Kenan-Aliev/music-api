const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const db = require("./db.js");
const authRoutes = require("./routes/auth.routes");
const authorRoutes = require("./routes/authors.routes");
const genreRoutes = require("./routes/genre.routes");
const tokenRoutes = require("./routes/tokens.routes");
const trackRoutes = require("./routes/track.routes");
const playlistRoutes = require("./routes/playlists.routes");
const albumRoutes = require("./routes/albums.routes");
// const trackListRoutes = require("./routes/tracklist.routes");
const errorMiddleware = require("./middlewares//exception.middleware");

const PORT = process.env.PORT || 5000;
global._basedir = __dirname;
const server = express();
server.use(express.static(__dirname + "/music"));
server.use(fileUpload({}));
server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    credentials: true,
    origin: "https://music-platform-lg9s.vercel.app",
  })
);
server.use("/auth", authRoutes);
server.use("/author", authorRoutes);
server.use("/genre", genreRoutes);
server.use("/token", tokenRoutes);
server.use("/track", trackRoutes);
server.use("/playlist", playlistRoutes);
server.use("/album", albumRoutes);

// server.use("/trackList", trackListRoutes);
server.use(errorMiddleware);

const start = async () => {
  try {
    await db.sync();
    server.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
