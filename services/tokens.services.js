const { Token } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/exceptions");

class TokenServices {
  gererateTokens(userId, userEmail, username, userRole) {
    const accessToken = jwt.sign(
      { userId, userEmail, username, userRole },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { userId, userEmail, username, userRole },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(refreshToken, userId) {
    const candidate = await Token.findOne({ where: { userId } });
    if (candidate) {
      await Token.update({ refreshToken }, { where: { userId } });
    } else {
      await Token.create({ refreshToken, userId });
    }
  }

  validateAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }

  async refresh(refreshToken) {
    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.getRefresh(userData?.userId, refreshToken);
    if (!refreshToken || !userData || !tokenFromDB) {
      throw ApiError.UnAuthorizedError("Попробуйте заново авторизоваться");
    }
    const tokens = this.gererateTokens(
      userData.userId,
      userData.userEmail,
      userData.username,
      userData.userRole
    );
    await this.saveRefreshToken(tokens.refreshToken, userData.userId);
    return {
      user: {
        id: userData.userId,
        email: userData.userEmail,
        username: userData.username,
        isAdmin: userData.userRole === "admin",
      },
      tokens,
    };
  }

  validateRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }
  async getRefresh(userId, refreshToken) {
    const token = await Token.findOne({ refreshToken, userId });
    return token;
  }
}

module.exports = new TokenServices();
