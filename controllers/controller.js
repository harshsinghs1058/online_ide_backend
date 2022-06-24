const Job = require("./../models/Job");
const { generateFile } = require("./../generatFile");
const { executeCpp } = require("./../execute_code/executeCpp");
const { executePy } = require("./../execute_code/executePy");

const runCode = async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  let job;
  try {
    const filepath = await generateFile(language, code);
    job = await Job({ language, filepath }).save();
    const jobid = job["_id"];
    console.log(job);
    console.log(jobid);
    res.status(201).json({ success: true, jobid });
    // let output;
    // job["startedAt"] = new Date();
    // if (language == "cpp") {
    // output = await executeCpp(filepath);
    // } else {
    // output = await executePy(filepath);
    // }
    // job["completedAt"] = new Date();
    // console.log(job["completedAt"]);
    // job["status"] = "success";
    // job["output"] = output;
    // await job.save();
    // console.log(filepath);
  } catch (err) {
    // job["completedAt"] = new Date();
    // job["status"] = "error";
    // job["output"] = JSON.stringify(err);
    // await job.save();
    console.log(err);
    res.status(500).json(err);
  }
};

const getStatus = async (req, res) => {
  const jobId = req.query.id;
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
