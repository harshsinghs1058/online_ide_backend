const Job = require("./../models/Job");
const { generateFile } = require("./../generatFile");
const { executeCpp } = require("./../execute_code/executeCpp");
const { executePy } = require("./../execute_code/executePy");
const { addJobToQueue } = require("./../jobQueue");
const runCode = async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  // need to generate a c++ file with content from the request
  const filepath = await generateFile(language, code);
  // write into DB
  const job = await new Job({ language, filepath }).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
};

const getStatus = async (req, res) => {
  const jobId = req.query.id;
  console.log(res);
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }
  const job = await Job.findById(jobId); //find inside the db

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });
};
exports.runCode = runCode;
exports.getStatus = getStatus;
