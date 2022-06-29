const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const dirCodes = path.join(__dirname, "codes");
const dirCodesInput = path.join(__dirname, "inputCompiler");
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
if (!fs.existsSync(dirCodesInput)) {
  fs.mkdirSync(dirCodesInput, { recursive: true });
}
const generateFile = async (format, content, input) => {
  const jobid = uuid();
  const fileName = `${jobid}.${format}`;
  const inputFileName = `${jobid}.txt`;
  const filePath = path.join(dirCodes, fileName);
  const inputFilePath = path.join(dirCodesInput, inputFileName);
  fs.writeFileSync(filePath, content);
  fs.writeFileSync(inputFilePath, input);
  return { filePath, inputFilePath };
};
module.exports = {
  generateFile,
};
