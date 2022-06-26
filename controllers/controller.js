const Job = require("./../models/Job");
const { generateFile } = require("./../generatFile");
const { addJobToQueue } = require("./../jobQueue");
const runCode = async (req, res) => {
  console.log("\n*************************\n");
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }
  if (language != "cpp" && language != "c" && language != "python")
  {
    return res.status(400).json({ success: false, error: "language is not supported" });
    }
  

  // need to generate a c++ file with content from the request
  const filepath = await generateFile(language, code);
  // write into DB
  const job = await new Job({ language, filepath }).save();
  console.log(job["_id"]);
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
};

const getStatus = async (req, res) => {
  const jobId = req.query.id;
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }
  try {
    const job = await Job.findById(jobId); //find inside the db

    if (job === undefined) {
      return res.status(400).json({ success: false, error: "couldn't find job" });
    }

    return res.status(200).json({ success: true, job });
  }
  catch (e) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }
};
exports.runCode = runCode;
exports.getStatus = getStatus;
