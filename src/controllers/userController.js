const userModel = require("../models/userModel");
const {
  isValid,
  isValidBody,
  isValidId,
  isValidFile,
} = require("../validations/validators");

const aws = require("../aws/awsConfig");
const jobModel = require("../models/jobModel");

const createApplication = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data" });
    }

    let { name, email, jobId } = data;

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "please enter name" });
    }

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct name" });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "please enter email" });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct email address" });
    }

    let checkApplication = await userModel.findOne({
      email: email,
      jobId: jobId,
    });

    if (checkApplication) {
      return res.status(400).send({
        status: false,
        message: "you have already filled the application",
      });
    } else {
      if (!jobId) {
        return res
          .status(400)
          .send({ status: false, message: "please enter JobID" });
      }

      if (!isValidId(jobId)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter correct JobID" });
      }

      let files = req.files;
      if (!files) {
        return res
          .status(400)
          .send({ status: false, message: "files are required" });
      } else {
        if (!isValidFile(files[0].originalname)) {
          return res.status(400).send({
            status: false,
            message: "files format should be jpg/pdf only",
          });
        }
      }

      let resume = await aws.uploadFile(files[0]);
      data.resume = resume;

      let files2 = req.files;
      if (!files2) {
        return res
          .status(400)
          .send({ status: false, message: "files are required" });
      } else {
        if (!isValidFile(files2[1].originalname)) {
          return res.status(400).send({
            status: false,
            message: "files format should be jpg only",
          });
        }
      }

      let coverletter = await aws.uploadFile(files2[1]);
      data.coverletter = coverletter;
    }

    let sendApplication = await userModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Application sent successfully",
      data: sendApplication,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

const getJobPostingDetails = async (req, res) => {
  try {
    let data = req.query;
    let { skills, experience, jobId } = data;

    if (!data) {
      return res.status(400).send({
        status: false,
        message: "please enter some data",
      });
    }

    if (!skills) {
      return res.status(400).send({
        status: false,
        message: "please enter some skills",
      });
    }

    if (!experience) {
      return res.status(400).send({
        status: false,
        message: "please enter some experience data",
      });
    }

    if (!jobId) {
      return res.status(400).send({
        status: false,
        message: "please enter jobId data",
      });
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;

    let findJobData = await jobModel
      .find({ isDeleted: false, data })
      .skip((page - 1) * limit)
      .limit(limit);
    return res
      .status(200)
      .send({ status: false, message: "success", data: findJobData });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

const updateApplicationDetails = async (req, res) => {
  try {
    let userId = req.params.userId;
    let data = req.body;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data" });
    }

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter userId" });
    }

    if (!isValidId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct userId" });
    }

    let checkUser = await userModel.findOne(
      { userId: userId },
      { isDeleted: false }
    );
    if (!checkUser) {
      return res
        .status(404)
        .send({ status: false, message: "user does not exist" });
    }

    let updateUser = await userModel.findOneAndUpdate(
      { userId: userId },
      { $set: { ...data } },
      { new: true }
    );
    return res.status(200).send({
      status: false,
      message: "update successfully",
      data: updateUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter userId" });
    }

    if (!isValidId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct userId" });
    }

    let checkUser = await userModel.findOne(
      { userId: userId },
      { isDeleted: false }
    );
    if (!checkUser) {
      return res
        .status(404)
        .send({ status: false, message: "user does not exist" });
    }

    await userModel.findOneAndUpdate(
      { userId: userId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: `this is catch error ${error.message}` });
  }
};

module.exports = {
  createApplication,
  getJobPostingDetails,
  updateApplicationDetails,
  deleteUser,
};
