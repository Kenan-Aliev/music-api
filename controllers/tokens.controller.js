const tokenService = require("../services/tokens.services");

class TokenController {
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await tokenService.refresh(refreshToken);
      return res.json(tokens);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TokenController();
