const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegepx = /[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegepx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const userJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegepx).required(),
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegepx,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User, userJoiSchema };
