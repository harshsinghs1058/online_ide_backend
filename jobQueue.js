const Queue = require("bull");

const Job = require("./models/Job");
const { executeCpp } = require("./execute_code/executeCpp");
const { executePy } = require("./execute_code/executePy");

const jobQueue = new Queue("job-runner-queue", {
  redis: {
    port: 6379,
    host: "127.0.0.1",
  },
  limiter: {
    duration: 3000,
    max: 4,
  },
});
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`);
  }
  try {
    let output;
    job["startedAt"] = new Date();
    const timer = setTimeout(async () => {
      job["completedAt"] = new Date();
      job["output"] = JSON.stringify("Time limit exceded");
      job["status"] = "error";
      await job.save();
    }, 3000);
    if (job.language === "cpp") {
      output = await executeCpp(job.filepath);
    } else if (job.language === "py") {
      output = await executePy(job.filepath);
    }
    clearTimeout(timer);
    job["completedAt"] = new Date();
    job["output"] = output;
    job["status"] = "success";
    await job.save();
    console.log("OutputSend\n");
    return true;
  } catch (err) {
    clearTimeout(timer);
    job["completedAt"] = new Date();
    job["output"] = JSON.stringify(err);
    job["status"] = "error";
    await job.save();
    console.log(job["output"]);
    throw Error(JSON.stringify(err));
  }
});

jobQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});

const addJobToQueue = async (jobId) => {
  jobQueue.add({
    id: jobId,
  });
};

module.exports = {
  addJobToQueue,
};
