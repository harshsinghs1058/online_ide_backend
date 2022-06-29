const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputFilePath, jobId) => {
  const outputFilePath = outputPath + "\\" + jobId;
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outputFilePath} && ${outputFilePath}.exe < ${inputFilePath} `, //double back slash to prevent escaping of backticks or dollar sign
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
