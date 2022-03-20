const authServices = require("../services/auth.services");
const { validationResult } = require("express-validator");
const ApiError = require("../utils/exceptions");

class AuthController {
  async registration(req, res, next) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        throw ApiError.ValidationError(validationErrors.array()[0].msg);
      }
      await authServices.registration(req.body);
      return res.json({ message: "Вы успешно прошли регистрацию" });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const data = await authServices.login(req.body);
      res.cookie("refreshToken", data.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        message: "Вы успешно вошли в свой аккаунт",
        ...data,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const response = await authServices.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
