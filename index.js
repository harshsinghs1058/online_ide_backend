const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { runCode, getStatus } = require("./controllers/controller");

const app = express();

//Express file usages
app.use(express.urlencoded({ extended: true })); // for post req
app.use(express.json()); // for parsing json data
app.use(cors()); //for cross origin access

//TASK: change URL to ENV
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
//Connection check route
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

//TYPE: POST
//req: code, language({cpp,c,py}), input
//res: jobId
app.post("/run", runCode);

//TYEPE: GET
//req: jobId
//res: job
app.get("/status", getStatus);

//POST env for production
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`listening to server http://localhost:${PORT}`);
});
