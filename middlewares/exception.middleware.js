const ApiError = require("../utils/exceptions");

module.exports = function (err, req, res, next) {
  if (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  } else {
    next();
  }
};
