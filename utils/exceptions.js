class ApiError extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
  }
  static ClientError(msg) {
    return new ApiError(msg, 400);
  }
  static UnAuthorizedError(msg) {
    return new ApiError(msg, 403);
  }
  static ValidationError(msg) {
    return new ApiError(msg, 422);
  }
}

module.exports = ApiError;