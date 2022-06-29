const Job = require("./../models/Job");
const { generateFile } = require("./../generatFile");
const { addJobToQueue } = require("./../jobQueue");

//TYPE: POST
//req: code, language({cpp,c,py}), input
//res: jobId
const runCode = async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;
  if (code === undefined)
    return res.status(400).json({ success: false, error: "Empty code body" });
  if (language != "cpp" && language != "c" && language != "py") {
    return res
      .status(400)
      .json({ success: false, error: "language is not supported" });
  }

  // need to generate a c++ file with content from the request
  const { filePath, inputFilePath } = await generateFile(language, code, input);

  // write into DB
  const job = await new Job({ language, filePath, inputFilePath }).save();
  console.log(job["_id"]);
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
};

//TYEPE: GET
//req: jobId
//res: Job
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
      return res
        .status(400)
        .json({ success: false, error: "couldn't find job" });
    }

    return res.status(200).json({ success: true, job });
  } catch (e) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }
};
exports.runCode = runCode;
exports.getStatus = getStatus;
