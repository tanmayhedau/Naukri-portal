const mongoose = require("mongoose");

const isValidMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  if (typeof value === "string" && value.trim().length === 0) {
    return false;
  }

  return true;
};

const isValidNumber = function (value) {
  if (typeof value === Number && value.trim().length === 0) return false;

  if (value > 100 || value < 0) return false;

  return true;
};

const isValidBody = (data) => {
  return Object.keys(data).length > 0;
};

const isValidPassword = (password) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
    password
  );
};

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidEmail = (mail) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
};

const isValidFile = (img) => {
  const regex = /(\/*\.(?:png|gif|webp|jpeg|jpg))/.test(img);
  return regex;
};

module.exports = {
  isValid,
  isValidNumber,
  isValidBody,
  isValidEmail,
  isValidId,
  isValidMobile,
  isValidPassword,
  isValidFile,
};
