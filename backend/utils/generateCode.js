// backend/utils/generateCode.js

const generateCode = (prefix, count, length = 4) => {
  return prefix + String(count + 1).padStart(length, "0");
};

module.exports = generateCode;
