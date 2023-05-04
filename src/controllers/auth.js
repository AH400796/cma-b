const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890", 6);

const { ctrlWrapper, HttpError, sendVerificEmail } = require("../helpers");
const { User } = require("../models");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (user.verificationCode) {
      res.status(409).json({
        user: { email, verificationCode: user.verificationCode },
        message: "This email is already registered and only need to be verify. Please check your email",
      });
    }
    throw HttpError(409, "This email is already registered");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();
  const newUser = await User.create({ ...req.body, password: hashPassword, verificationCode });
  const verificEmail = {
    to: email,
    subject: "Registration on Crypto Markets Arbitrage application",
    html: `<p>Your registration attepmt was succesfull! Please, verify you email now.</p>
    <p> Your verification code:</p> <h1>${verificationCode}</h1>`,
  };
  await sendVerificEmail(verificEmail);
  res.status(200).json({ user: { email: newUser.email } });
};

const verify = async (req, res) => {
  const { verificationCode } = req.body;

  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(400, "Invalid verification code. Please try again.");
  }

  await User.findByIdAndUpdate(user._id, { verified: true, verificationCode: "" });

  res.status(200).json({ message: "Verification successful! Now you will be redirected to the login section" });
};

const reverify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verificEmail = {
    to: email,
    subject: "Registration on Crypto Markets Arbitrage application",
    html: `<p>Your registration attepmt was succesfull! Please, verify you email now.</p>
    <p> Your verification code:</p> <h1>${user.verificationCode}</h1>`,
  };
  await sendVerificEmail(verificEmail);
  res.status(200).json({
    message: "Verification code resent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verified) {
    throw HttpError(401, "Email not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    email: user.email,
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(200).end();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  reverify: ctrlWrapper(reverify),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
};
