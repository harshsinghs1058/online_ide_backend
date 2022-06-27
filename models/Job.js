const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["cpp", "py","c"],
  },
  filepath: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  inputfilename: {
    type: String,
    //required: true,
  },
  output: {
    type: String,
  },

});

// default export
module.exports = mongoose.model("job", JobSchema);