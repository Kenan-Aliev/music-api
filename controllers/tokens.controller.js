const tokenService = require("../services/tokens.services");

class TokenController {
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const data = await tokenService.refresh(refreshToken);
      res.cookie("refreshToken", data.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        message: "Вы авторизованы",
        ...data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TokenController();
