const jobModel = require("../models/jobModel");
const userModel = require("../models/userModel");
const {
  isValidId,
  isValidBody,
  isValid,
  isValidEmail,
  isValidNumber,
} = require("../validations/validators");

const createJob = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;
    let { title, description, email, skills, experience } = data;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data" });
    }

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter userID data" });
    }

    if (!isValidId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct userID data" });
    }

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "please enter title data" });
    }

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid title data" });
    }

    if (!description) {
      return res
        .status(400)
        .send({ status: false, message: "please enter description data" });
    }

    if (!isValid(description)) {
      return res.status(400).send({
        status: false,
        message: "please enter correct description data",
      });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "please enter email data" });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct email data" });
    }

    if (!skills) {
      return res
        .status(400)
        .send({ status: false, message: "please enter skills data" });
    }

    if (!isValid(skills)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct skills data" });
    }

    if (!experience) {
      return res
        .status(400)
        .send({ status: false, message: "please enter experience data" });
    }

    if (!isValidNumber(experience)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid experience data" });
    }

    let checkUnique = await jobModel.findOne({
      email: email,
      userId: userId,
      title: title,
      description: description,
      skills: skills,
      experience: experience,
    });
    if (checkUnique) {
      return res
        .status(409)
        .send({ status: false, message: "job is posted already" });
    } else {
      data["userId"] = userId;

      let savedData = await jobModel.create(data);
      return res
        .status(201)
        .send({ status: true, message: "success", data: savedData });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const getApplicationDetails = async (req, res) => {
  try {
    let jobId = req.params.jobId;

    let findApplicants = await userModel.find({ jobId: jobId });
    if (!findApplicants) {
      return res
        .status(404)
        .send({ status: false, message: "no application found" });
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;

    let recievedApplications = await userModel
      .find({ jobId: jobId })
      .select({ name: 1, email: 1, resume: 1, coverletter: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).send({
      status: true,
      message: "getting list successful",
      data: recievedApplications,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const updateJobDetails = async (req, res) => {
  try {
    let data = req.body;
    let jobId = req.params.jobId;
    let { title, description, email, skills, experience } = data;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data" });
    }

    if (!jobId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter jobId data" });
    }

    if (!isValidId(jobId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct jobId data" });
    }

    if (title) {
      if (!isValid(title)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter valid title data" });
      }
    }

    if (description) {
      if (!isValid(description)) {
        return res.status(400).send({
          status: false,
          message: "please enter correct description data",
        });
      }
    }

    if (email) {
      if (!isValidEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter correct email data" });
      }
    }

    if (skills) {
      if (!isValid(skills)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter correct skills data" });
      }
    }

    if (experience) {
      if (!isValidNumber(experience)) {
        return res.status(400).send({
          status: false,
          message: "please enter valid experience data",
        });
      }
    }

    let checkJob = await jobModel.findOne({ _id: jobId, isDeleted: false });

    if (!checkJob) {
      return res.status(404).send({ status: false, message: "job not found" });
    }

    let updateData = await jobModel.findOneAndUpdate(
      { _id: checkJob._id },
      { $set: { ...data } },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "job updated successfully",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const deleteJobDetails = async (req, res) => {
  try {
    let jobId = req.params.jobId;

    if (!jobId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter jobId data" });
    }

    if (!isValidId(jobId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter correct jobId data" });
    }

    let checkJob = await jobModel.findOne({ _id: jobId });
    if (!checkJob) {
      return res.status(404).send({ status: false, message: "job not found" });
    }

    await jobModel.findOneAndUpdate(
      { _id: jobId },
      { $set: { isDeleted: true } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "job deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {
  createJob,
  getApplicationDetails,
  updateJobDetails,
  deleteJobDetails,
};
