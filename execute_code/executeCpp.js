const { exec, execSync, ChildProcess } = require("child_process");
const fs = require("fs");
const path = require("path");
const {kill } =require("process");

const outputPath = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputFilePath, jobId) => {
  const outputFilePath = outputPath + "\\" + jobId;
  return new Promise((resolve, reject) => { 
    let output;
    setTimeout(() => {
      if (output === undefined) {
        execSync(`taskkill /F /IM ${jobId}.exe`)
        resolve("Time Limit Exceeded");
      }
    }, 6000);
    exec(
      `g++ ${filePath} -o ${outputFilePath} && ${outputFilePath}.exe < ${inputFilePath} `, //double back slash to prevent escaping of backticks or dollar sign
      (error, stdout, stderr) => {
        output = ".";
        error && reject({ error, stderr });
        stderr && reject(stderr);
        output = stdout;
        resolve(stdout);
      }
    );
     
  });
};

module.exports = {
  executeCpp,
};
