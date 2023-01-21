const express = require("express");
const { createJob, getApplicationDetails, updateJobDetails, deleteJobDetails } = require("../controllers/jobController");
const {createSignedupUser,loginUser,} = require("../controllers/signupController");
const { createApplication, getJobPostingDetails, updateApplicationDetails, deleteUser } = require("../controllers/userController");
const {authenticate,authorisation}=require("../middleware/auth")
const router = express.Router();


router.post("/singup", createSignedupUser);
router.post("/login", loginUser);


//=======job APIs==========//
router.post("/job/:userId",authenticate,authorisation, createJob);
router.get("/getApplications/:jobId",authenticate,getApplicationDetails)
router.put("/updateJob/:jobId/:userId",authenticate,authorisation,updateJobDetails)
router.delete("/deleteJob/:jobId/:userId",authenticate,authorisation,deleteJobDetails)


//=======user APIs=========//
router.post("/application/:userId",authenticate,authorisation, createApplication);
router.get("/findJob/:userId",authenticate,getJobPostingDetails);
router.put("/updateUser/:userId",authenticate,authorisation,updateApplicationDetails);
router.delete("/deleteUser/:userId",authenticate,authorisation,deleteUser);


router.all("/*", function (req, res) {
  res.status(400).send({
      status: false,
      message: "Enter proper URL !!!"
  })
})



module.exports = router;
