const { User, Token } = require("../models/index");
const bcrypt = require("bcrypt");
const tokensService = require("./tokens.services");
const ApiError = require("../utils/exceptions");
const trackListService = require("../services/tracklist.services");

class AuthServices {
  async registration(userData) {
    console.log(userData);
    const hashedPassword = await bcrypt.hash(userData.password, 8);
    const user = await User.create({
      email: userData.email,
      username: userData.username,
      // role: "admin",
      password: hashedPassword,
    });
    if (user.role !== "admin") {
      await trackListService.create(user.id);
    }
    if (user.dataValues) {
      return "Вы успешно прошли регистрацию";
    } else {
      throw new Error(
        "Произошла непредвиденная ошибка.Повторите попытку позже"
      );
    }
  }

  async login(userData) {
    const candidate = await User.findOne({ where: { email: userData.email } });
    if (!candidate) {
      throw ApiError.ClientError("Пользователя с таким email не существует");
    }
    const isValidPassword = await bcrypt.compare(
      userData.password,
      candidate.password
    );
    if (!isValidPassword) {
      throw ApiError.ClientError("Укажите верный пароль");
    }
    const tokens = tokensService.gererateTokens(
      candidate.id,
      candidate.email,
      candidate.username,
      candidate.role
    );

    await tokensService.saveRefreshToken(tokens.refreshToken, candidate.id);
    return {
      user: {
        id: candidate.id,
        email: candidate.email,
        username: candidate.username,
        isAdmin: candidate.role === "admin",
      },
      tokens,
    };
  }

  async logout(refreshToken) {
    const userData = tokensService.validateRefreshToken(refreshToken);
    const response = await Token.destroy({
      where: { userId: userData.userId, refreshToken },
    });
    if (response > 0) {
      return { message: "Вы успешно вышли из своего аккаунта" };
    }
    throw new Error("Произошла непредвиденная ошибка");
  }
}

module.exports = new AuthServices();
