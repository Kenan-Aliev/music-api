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

const PlayLists_Tracks = db.define("playlists_tracks", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

const UserTrackList_Tracks = db.define("trackLists_tracks", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

//relations

Author.hasMany(Track, {
  onDelete: "cascade",
  foreignKey: "authorId",
  as: "tracks",
});
Track.belongsTo(Author, { foreignKey: "authorId" });

Genre.hasMany(Track, {
  onDelete: "cascade",
  foreignKey: "genreId",
  as: "tracks",
});
Track.belongsTo(Genre, { foreignKey: "genreId" });

User.hasOne(Token, { onDelete: "cascade", foreignKey: "userId", as: "token" });
Token.belongsTo(User, { foreignKey: "userId" });

User.hasOne(UserTrackList, {
  onDelete: "cascade",
  foreignKey: "userId",
  as: "trackList",
});
UserTrackList.belongsTo(User, { foreignKey: "userId" });

UserTrackList.belongsToMany(Track, { through: UserTrackList_Tracks });
Track.belongsToMany(UserTrackList, { through: UserTrackList_Tracks });

User.hasMany(PlayList, {
  onDelete: "cascade",
  foreignKey: "userId",
  as: "playlists",
});
PlayList.belongsTo(User, { foreignKey: "userId" });

PlayList.belongsToMany(Track, { through: PlayLists_Tracks });
Track.belongsToMany(PlayList, { through: PlayLists_Tracks });

module.exports = {
  User,
  Genre,
  Token,
  Track,
  Author,
  UserTrackList,
  PlayList,
  PlayLists_Tracks,
  UserTrackList_Tracks,
};
