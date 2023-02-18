"use strict";
// TODO: Include packages needed for this application
const inquirer = require("inquirer");
const fsPromises = require("fs").promises;
// const fs = require("fs");
const path = require("path");
const os = require("os");

const desktopPath = path.join(os.homedir(), "Desktop");
const readmeFileName = path.join(desktopPath, "README.txt");

// TODO: Create an array of questions for user input
const questions = [
  {
    type: "input",
    name: "input_type",
    message: "What is your name?",
    validate: (input) => {
      if (input === "") {
        return "Enter valid name";
      } else return true;
    },
  },
  {
    type: "input",
    name: "height",
    message: "What is your height in inches?",
    validate: (input) => {
      if (isNaN(input)) {
        return "Enter valid number";
      } else if (input === "") {
        return "Enter valid number";
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "weight",
    message: "What is your weight in pounds?",
    validate: (input) => {
      if (isNaN(input)) {
        return "Enter valid number";
      } else if (input === "") {
        return "Enter valid number";
      } else {
        return true;
      }
    },
  },
  {
    type: "list",
    name: "list_type",
    message: "What programming languages do you know?",
    choices: ["Javascript", "C++", "Java", "Python"],
    default: "Javascript",
  },
  {
    type: "checkbox",
    name: "checkbox_questions",
    message: "What programming languages do you know?",
    choices: ["Javascript", "C++", "Java", "Python"],
    default: "Javascript",
  },
];

// TODO: Create a function to write README file
async function writeToFile(fileName, data) {
  try {
    await fsPromises.writeFile(fileName, data);
    // const newData = await fsPromises.readFile(fileName, "utf8");
    // console.log(newData);
  } catch (err) {
    console.log(err);
  }

  process.on("uncaughtException", (err) => {
    console.log(`There was an uncaught error: ${err}`);
    process.exit;
  });
}

// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions).then((answers) => {
    const height = answers.height;
    const weight = answers.weight;
    const bmi = ((weight / (height * height)) * 703).toFixed(2);
    // Use user feedback for... whatever!!
    const output = `Your BMI is ${bmi}`;
    console.log(output);
    writeToFile(readmeFileName, output);
  });
}

// Function call to initialize app
init();
