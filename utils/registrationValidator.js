const { body } = require("express-validator");
const { User } = require("../models/index.js");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email. Пример user@gmail.com")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          return Promise.reject("Пользователь с таким email уже существует");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),

  body("username")
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage(
      "Длина вашего никнейма должна быть минимум 3 и максимум 15 символов"
    )
    .isAlphanumeric()
    .trim()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ where: { username: value } });
        if (user) {
          return Promise.reject(
            "Пользователь с таким никнеймом уже существует"
          );
        }
      } catch (error) {
        console.log(error);
      }
    }),
  body("password")
    .isLength({
      min: 6,
      max: 16,
    })
    .withMessage(
      "Длина пароля должна быть минимум 9 символов и максимум 16 символов"
    )
    .isAlphanumeric()
    .trim(),
];
