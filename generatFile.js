const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const dirCodes = path.join(__dirname, "codes");
const dirCodesInput = path.join(__dirname, "inputCompiler");
if (!fs.existsSync(dirCodes))
{
    fs.mkdirSync(dirCodes, { recursive: true });
}
if (!fs.existsSync(dirCodesInput))
{
    fs.mkdirSync(dirCodesInput, { recursive: true });
}
const generateFile = async (format, content,input) => {
    const jobid = uuid();
    const filename = `${jobid}.${format}`;
    const inputfilename=`${jobid}.txt`;
    const filepath = path.join(dirCodes, filename);
    const inputfilepath = path.join(dirCodesInput, inputfilename);
    fs.writeFileSync(filepath, content);
    fs.writeFileSync(inputfilepath, input);
    return { filepath, inputfilename };
    
};
module.exports = {
    generateFile,
};