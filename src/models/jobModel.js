const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
    },
    experience: {
      type: Number,
      default: 0 - 1,
    },
    userId: {
      type: ObjectId,
      ref: "user",
      require: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("job", jobSchema);
