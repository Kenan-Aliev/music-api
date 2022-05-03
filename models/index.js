const Sequelize = require("sequelize");
const db = require("../db");

//models
const User = db.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Track = db.define("tracks", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Token = db.define("tokens", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Genre = db.define("genres", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Author = db.define("authors", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const UserTrackList = db.define("trackLists", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

const PlayList = db.define("playlists", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  playList_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Album = db.define("albums", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

//relations
Author.hasMany(Track, {
  onDelete: "cascade",
});
Track.belongsTo(Author);

Author.hasMany(Album, {
  onDelete: "cascade",
});
Album.belongsTo(Author);

Album.hasMany(Track);
Track.belongsTo(Album);

Genre.hasMany(Track, {
  onDelete: "cascade",
});
Track.belongsTo(Genre);

User.hasOne(Token, { onDelete: "cascade" });
Token.belongsTo(User);

User.hasOne(UserTrackList, {
  onDelete: "cascade",
});
UserTrackList.belongsTo(User);

UserTrackList.belongsToMany(Track, { through: "userTrackList_tracks" });
Track.belongsToMany(UserTrackList, { through: "userTrackList_tracks" });

User.hasMany(PlayList, {
  onDelete: "cascade",
});
PlayList.belongsTo(User);

PlayList.belongsToMany(Track, { through: "playlists_tracks" });
Track.belongsToMany(PlayList, { through: "playlists_tracks" });

module.exports = {
  User,
  Genre,
  Token,
  Track,
  Author,
  UserTrackList,
  PlayList,
  Album,
};
