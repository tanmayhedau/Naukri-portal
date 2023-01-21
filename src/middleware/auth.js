const jwt = require("jsonwebtoken");
const singupModel = require("../models/signupModel");
const { isValidId } = require("../validations/validators");

const authenticate = async (req, res, next) => {
  try {
    let token = req.headers["x-api-key"];

    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "please enter token" });
    }

    jwt.verify(token, "job-board", (error, decodeToken) => {
      if (error) {
        return res
          .status(400)
          .send({ status: false, message: "token is not correct" });
      }
      req["decodeToken"] = decodeToken;

      next();
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

const authorisation = async (req, res, next) => {
  try {
    let userId = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter userId" });
    }

    if (!isValidId(userId)) {
      return res.status(400).send({
        status: false,
        message: "please enter correct userId",
      });
    }

    let checkUserId = await singupModel.findOne({ _id: userId });
    if (!checkUserId) {
      return res
        .status(400)
        .send({ status: false, message: "userId not found" });
    }

    if (checkUserId._id != req["decodeToken"]._id) {
      return res.status(403).send({
        status: false,
        message: "you are not authorised to perform this task",
      });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

module.exports = { authenticate, authorisation };
