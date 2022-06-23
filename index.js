const express = require("express");
const cors = require("cors");
//requiring only v4 remember the syntax of exporting v4 and renaming it to uuid for easy use
const { generateFile } = require("./generatFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const mongoose = require("mongoose");
const Job = require("./models/Job");

const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.urlencoded({ extended: true })); //to parse the data in usable format coming from req as post req
app.use(cors);

mongoose.connect(
  "mongodb+srv://daksh:daksh1234@cluster0.kqa9w.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else console.log("succesfully connected to db");
  }
);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (code === undefined)
    return res.status(400).json({ success: false, error: "Empty code body" });
  let job;
  console.log(code);
  try {
    const filepath = await generateFile(language, code);
    job = await Job({ language, filepath }).save();
    const jobid = job["_id"];
    console.log(job);
    res.status(201).json({ success: true, jobid });
    let output;
    job["startedAt"] = new Date();
    if (language == "cpp") {
      output = await executeCpp(filepath);
    } else {
      output = await executePy(filepath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;
    await job.save();

    console.log(filepath);
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(err);
    await job.save();
    console.log(err);

    //res.status(500).json({ err });
  }
});
app.get("/status", async (req, res) => {
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
});

app.listen(9000, () => {
  console.log(`listening to server http://127.0.0.1:${PORT}`);
});
