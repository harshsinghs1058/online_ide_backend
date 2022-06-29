const Queue = require("bull");
const fs = require("fs");
const Job = require("./models/Job");
const { executeCpp } = require("./execute_code/executeCpp");
const { executePy } = require("./execute_code/executePy");
const { obliterate } = require("bull/lib/scripts");

let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const jobQueue = new Queue("job-runner-queue", REDIS_URL, {
  limiter: {
    duration: 3000,
    max: 4,
  },
});
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;
  const job = await Job.findById(jobId);
  if (job === undefined) throw Error(`cannot find Job with id ${jobId}`);

  try {
    let output;
    job.startedAt = new Date();

    if (job.language === "cpp" || job.language === "c")
      output = await executeCpp(job.filePath, job.inputFilePath, jobId);
    else if (job.language === "py")
      output = await executePy(job.filePath, job.inputFilePath);

    await jobCompleted(output, "success", job);

    return true;
  } catch (err) {
    await jobCompleted(err, "error", job);
  }
});

const addJobToQueue = (jobId) => {
  jobQueue.add({
    id: jobId,
  });
};

module.exports = {
  addJobToQueue,
};

const jobCompleted = async (output, status, job) => {
  job.completedAt = new Date();
  job.output = JSON.stringify(output);
  console.log(`\n${status}: ${job.output}`);
  job.status = status;
  fs.unlinkSync(job.filePath);
  fs.unlinkSync(job.inputFilePath);
  if (job.language === "cpp") fs.unlinkSync(`.\\outputs\\${job["_id"]}.exe`);
  await job.save();
};
