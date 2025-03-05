const path = require("path"); // Import path module
const jsdom = require("jsdom"); // Import JSDOM to create mock DOM
const { JSDOM } = jsdom; // Extract JSDOM class constructor

const renderDOM = async (filename) => {
  const filePath = path.join(__dirname, "../../", filename); // Adjusted path

  const dom = await JSDOM.fromFile(filePath, {
    runScripts: "dangerously", // Allow scripts execution
    resources: "usable",
  });

  return new Promise((resolve) => {
    dom.window.document.addEventListener("DOMContentLoaded", () => {
      resolve(dom);
    });
  });
};

module.exports = { renderDOM };
