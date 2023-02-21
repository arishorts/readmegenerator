//https://www.youtube.com/watch?v=Qf5EXOyGRxw&ab_channel=Markodex
//https://coding-boot-camp.github.io/full-stack/github/professional-readme-guide

// Include packages needed for this application
const generateMarkdown = require("./utils/generateMarkdown");
const inquirer = require("inquirer");
const fsPromises = require("fs").promises;
// const fs = require("fs");
const path = require("path");
const os = require("os");

const desktopPath = path.join(os.homedir(), "Desktop");
const readmeFileName = path.join(desktopPath, "README.md");

var hasUserName = false;
var hasRepo = false;
var hasTitle = false;
var hasDescription = false;
var hasUserStory = false;
let hasNewSkills = false;
var hasTableOfContents = false;
var hasUsage = false;
var hasBadges = false;
var hasHowToContribute = false;
var hasCredits = false;
var hasLicense = false;

async function renderLicenseSection(license) {
  const licenses = await getAPI(`/licenses`);
  //console.log(licenses);
  const licensesArray = []; // create an array to store badge strings
  for (let license in licenses) {
    licensesArray.push(`${licenses[license].name}`);
  }
  return licensesArray;
}

// Create an array of questions for user input
const questions = [
  {
    type: "input",
    name: "userName",
    message: "Enter the repo owner's user name",
    validate: (input) => {
      if (input === "") {
        hasUserName = true;
        return "Enter valid name";
      } else return true;
    },
  },
  {
    type: "input",
    name: "repo",
    message: "What is the title of the repo?",
    validate: (input) => {
      if (input === "") {
        hasRepo = true;
        return "Enter valid repo";
      } else return true;
    },
  },
  //   {
  //     type: "input",
  //     name: "title",
  //     message: "What is the title of your project?",
  //     validate: (input) => {
  //       if (input === "") {
  //         hasTitle = true;
  //         return "Enter valid title";
  //       } else return true;
  //     },
  //   },
  //   {
  //     type: "input",
  //     name: "description",
  //     message: "Share a description of the project",
  //     validate: (input) => {
  //       if (input === "") {
  //         hasDescription = true;
  //         return "Enter valid description";
  //       } else return true;
  //     },
  //   },
  //   {
  //     type: "input",
  //     name: "userStory",
  //     message: "Share a user story for the project",
  //     validate: (input) => {
  //       if (input === "") {
  //         hasUserStory = true;
  //         return "Enter valid story";
  //       } else return true;
  //     },
  //   },
  //   {
  //     type: "input",
  //     name: "description",
  //     message: "Type a description of the project",
  //     validate: (input) => {
  //       if (isNaN(input)) {
  //         return "Enter valid number";
  //       } else if (input === "") {
  //         return "Enter valid number";
  //       } else {
  //         return true;
  //       }
  //     },
  //   },
  {
    type: "list",
    name: "license",
    message: "What license did you use?",
    choices: async () => {
      const licenses = await generateMarkdown.getAPI(`/licenses`);
      const licensesArray = []; // create an array to store badge strings
      for (let license in licenses) {
        licensesArray.push(`${licenses[license].key}`);
      }
      return licensesArray;
    },
    default: "Javascript",
  },
  //   {
  //     type: "checkbox",
  //     name: "checkbox_questions",
  //     message: "What programming languages do you know?",
  //     choices: ["Javascript", "C++", "Java", "Python"],
  //     default: "Javascript",
  //   },
];

// Create a function to write README file
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

// Create a function to initialize app
async function init() {
  const answers = await inquirer.prompt(questions);
  const markdown = await generateMarkdown.generateMarkdown(answers);
  await writeToFile(readmeFileName, markdown);
}

// Function call to initialize app
init();
