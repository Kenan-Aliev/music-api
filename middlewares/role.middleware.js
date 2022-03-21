const tokenService = require("../services/tokens.services");
const ApiError = require("../utils/exceptions");

module.exports = function (roles) {
  return (req, res, next) => {
    try {
      const bearer = req.headers.authorization;
      if (!bearer) {
        throw ApiError.UnAuthorizedError(
          "Для доступа нужна авторизация на сайте"
        );
      }
      const token = bearer.split(" ")[1];
      const userData = tokenService.validateAccessToken(token);
      if (!userData) {
        throw ApiError.UnAuthorizedError("Неверный токен");
      }
      const roleIsHave = roles.some(
        (r) => r.toLowerCase() === userData.userRole.toLowerCase()
      );
      if (!roleIsHave) {
        throw ApiError.Forbidden("Доступ запрещен");
      }
      req.user = userData;
      next();
    } catch (err) {
      next(err);
    }
  };
};
