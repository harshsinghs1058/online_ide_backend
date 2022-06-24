const express = require("express");
const cors = require("cors");
//requiring only v4 remember the syntax of exporting v4 and renaming it to uuid for easy use
const mongoose = require("mongoose");
const { runCode, getStatus } = require("./controllers/controller");
const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//to parse the data in usable format coming from req as post req
app.use(cors());

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
app.post("/run", runCode);

app.get("/status", getStatus);

app.listen(9000, () => {
  console.log(`listening to server http://localhost:${PORT}`);
});
