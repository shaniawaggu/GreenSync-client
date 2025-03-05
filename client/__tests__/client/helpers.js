const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const renderDOM = async (filename) => {
  const filePath = path.join(__dirname, "..", "..", filename); // Adjust path
  const dom = await JSDOM.fromFile(filePath, {
    runScripts: "dangerously",
    resources: "usable",
  });

  return new Promise((resolve) => {
    dom.window.document.addEventListener("DOMContentLoaded", () => {
      resolve(dom);
    });
  });
};

module.exports = { renderDOM };
