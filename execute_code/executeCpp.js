const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "../outputs");
const inputPath = path.join(__dirname, "../inputCompiler");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath,inputfilename) => {
  const jobId = path.basename(filepath).split(".")[0];
  const inputId = path.basename(inputfilename).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  const inpath = path.join(inputPath, `${inputId}.txt`);
  console.log(inpath);
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe < ${inpath}`, //double back slash to prevent escaping of backticks or dollar sign
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  }); 
};

module.exports = {
  executeCpp,
};
