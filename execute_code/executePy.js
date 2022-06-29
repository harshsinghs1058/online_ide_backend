const { exec } = require("child_process");
const path = require("path");
const inputPath = path.join(__dirname, "../inputCompiler");
const executePy = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `python ${filePath} < ${inputFilePath}`, //double back slash to prevent escaping of backticks or dollar sign
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
