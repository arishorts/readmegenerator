//https://www.youtube.com/watch?v=Qf5EXOyGRxw&ab_channel=Markodex
//https://coding-boot-camp.github.io/full-stack/github/professional-readme-guide

// Include packages needed for this application
const generateMarkdown = require("./utils/generateMarkdown");
const inquirer = require("inquirer");
const fsPromises = require("fs").promises;
const path = require("path");
const os = require("os");

const desktopPath = path.join(os.homedir(), "Desktop");
const readmeFileName = path.join(desktopPath, "README.md");

var hasUserName = false;
var hasEmail = false;
var hasRepo = false;
var hasTitle = false;
var hasDescription = false;
var hasLicense = false;

// an array of questions for user input
const questions = [
  {
    type: "input",
    name: "userName",
    message: "Enter the repo owner's user name",
    validate: (input) => {
      if (input === "") {
        return "Enter valid name";
      }
      hasUserName = true;
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "Enter the repo owner's email",
    validate: (input) => {
      if (input === "") {
        return "Enter valid email";
      }
      hasEmail = true;
      return true;
    },
  },
  {
    type: "input",
    name: "repo",
    message: "What is the title of the repo?",
    validate: (input) => {
      if (input === "") {
        return "Enter valid repo";
      }
      hasRepo = true;
      return true;
    },
  },
  {
    type: "input",
    name: "title",
    message: "What is the title of your project?",
    validate: (input) => {
      if (input === "") {
        return "Enter valid title";
      }
      hasTitle = true;
      return true;
    },
  },
  {
    type: "input",
    name: "tests",
    message: "Share project tests",
    validate: (input) => {
      if (input === "") {
        return "Enter valid tests";
      }
      hasDescription = true;
      return true;
    },
  },
  {
    type: "input",
    name: "description",
    message: "Share a description of the project",
    validate: (input) => {
      if (input === "") {
        return "Enter valid description";
      }
      hasDescription = true;
      return true;
    },
  },
  {
    type: "list",
    name: "license",
    message: "What license did you use?",
    choices: async () => {
      const licenses = await generateMarkdown.getAPI(`/licenses`);
      const licensesArray = [];
      for (let license in licenses) {
        licensesArray.push(`${licenses[license].key.toUpperCase()}`);
      }
      return licensesArray;
    },
    validate: (input) => {
      if (input === "") {
        return "Choose valid license";
      }
      hasLicense = true;
      return true;
    },
  },
];

// writes README file
async function writeToFile(fileName, data) {
  try {
    await fsPromises.writeFile(fileName, data);
  } catch (err) {
    console.log(err);
  }
  process.on("uncaughtException", (err) => {
    console.log(`There was an uncaught error: ${err}`);
    process.exit;
  });
}

// initializes app
async function init() {
  const answers = await inquirer.prompt(questions);
  const markdown = await generateMarkdown.generateMarkdown(answers);
  await writeToFile(readmeFileName, markdown);
}

// call to initialize app
init();
