const path = require('path')        // Add path module to script
const jsdom = require('jsdom');     // Import JSDOM to script to create mock DOM
const { JSDOM } = jsdom;            // Extract class constructor from JSDOM import

const renderDOM = async (filename) => {     // Define function expression to return mock DOM
  const filePath = path.join(process.cwd(), filename); // Establish path between current working directory and desired file name
  
  const dom = await JSDOM.fromFile(filePath, {      // Use JSDOM constructor to build mock DOM
    runScripts: 'dangerously',      // Allow dangerous process to execute scripts on computer
    resources: 'usable'
  });

  return new Promise((resolve, _) => {
    dom.window.document.addEventListener('DOMContentLoaded', () => {
      resolve(dom);
    });
  });
};

module.exports = { renderDOM }; 