const signupModel = require("../models/signupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  isValidBody,
  isValid,
  isValidMobile,
  isValidEmail,
  isValidPassword,
} = require("../validations/validators");

//==============================================create api ===================================//

const createSignedupUser = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data" });
    }

    let { name, mobile, email, password } = data;

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "please enter full name!" });
    }

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid name" });
    }

    if (!mobile) {
      return res.status(400).send({
        status: false,
        message: "please enter mobile number!",
      });
    }

    if (!isValidMobile(mobile)) {
      return res.status(400).send({
        status: false,
        message: "please enter correct mobile number",
      });
    }

    if (!email) {
      return res.status(400).send({
        status: false,
        message: "please enter email address!",
      });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct email address" });
    }

    let checkSignupUser = await signupModel.findOne({email:email})
    if(checkSignupUser){
      return res
        .status(409)
        .send({ status: false, message: "please proceed to login" });
    }

    if (!password) {
      return res.status(400).send({
        status: false,
        message: "please enter correct password!",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password should be strong, please use one number, one upper case, one lower case and one special character and characters should be between 8 to 15 only!",
      });
    }

    let salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    let createUser = await signupModel.create(data);
    return res.status(201).send({
      status: true,
      message: "account created successfully",
      data: createUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

//======================================login api====================================//

const loginUser = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data" });
    }
    
    let { email, password } = data;

    if (!email) {
      return res.send({
        status: false,
        message: "please enter correct email address",
      });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct email address" });
    }

    let checkEmail = await signupModel.findOne({ email: email });
    if (!checkEmail) {
      return res.status(404).sen({ status: false, message: "email not found" });
    }

    if (!password) {
      return res.status(400).send({
        status: false,
        message: "please enter correct password!",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password should be strong, please use one number, one upper case, one lower case and one special character and characters should be between 8 to 15 only!",
      });
    }

    let encryptPassword = checkEmail.password;

    await bcrypt.compare(password, encryptPassword, (error, result) => {
      if (result) {
        let token = jwt.sign({ _id: checkEmail._id.toString() }, "job-board", {
          expiresIn: "72h",
        });

        return res.status(201).send({
          status: true,
          message: "user login successfully",
          data: { userId: checkEmail._id, token: token },
        });
      } else {
        return res
          .status(401)
          .send({ status: false, message: "please enter correct password" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

module.exports = { createSignedupUser, loginUser };
