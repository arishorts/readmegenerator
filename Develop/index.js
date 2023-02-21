//https://www.youtube.com/watch?v=Qf5EXOyGRxw&ab_channel=Markodex
//https://coding-boot-camp.github.io/full-stack/github/professional-readme-guide
//https://nodejs.org/api/https.html#httpsgetoptions-callback

// Include packages needed for this application
const generateMarkdown = require("./utils/generateMarkdown");
const inquirer = require("inquirer");
const fsPromises = require("fs").promises;
const path = require("path");
const os = require("os");
const { connect } = require("http2");

const desktopPath = path.join(os.homedir(), "Desktop");
const readmeFileName = path.join(desktopPath, "README.md");

// an array of questions for user input
const questions = [
  {
    type: "input",
    name: "userName",
    message: "Enter the repo owner's user name",
    validate: async (input) => {
      if (input === "") {
        return "Enter valid name";
      }
      try {
        const usernameExists = await generateMarkdown.getAPI(
          `https://api.github.com/users/${input}/repos`
        );
        if (
          !usernameExists ||
          usernameExists.length === 0 ||
          usernameExists.message == "Not Found"
        ) {
          return "Username does not exist. Enter a valid name";
        }
        return true;
      } catch (err) {
        console.log(err);
        return "An error occurred. Please try again";
      }
    },
  },
  {
    type: "list",
    name: "repo",
    message: "What is the title of the repo?",
    when: (answers) => {
      if (answers.userName == "") return false;
      return true;
    },
    choices: async (answers) => {
      const repos = await generateMarkdown.getAPI(
        `https://api.github.com/users/${answers.userName}/repos`
      );
      return repos.map((repo) => repo.name);
    },
  },
  {
    type: "input",
    name: "title",
    message: "What is the title of your project README?",
    validate: (input) => {
      if (input === "") {
        return "Enter valid title or none";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "Enter the repo owner's email",
    validate: (input) => {
      if (input === "") {
        return "Enter valid email or none";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "installation",
    message: "Are there special installation instructions?",
    validate: (input) => {
      if (input === "") {
        return "Enter valid input or none";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "tests",
    message: "Share project tests",
    validate: (input) => {
      if (input === "") {
        return "Enter valid tests or none";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "description",
    message: "Share a description of the project",
    validate: (input) => {
      if (input === "") {
        return "Enter valid description or none";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "license",
    message: "What license did you use?",
    choices: async () => {
      const licenses = await generateMarkdown.getAPI(`/licenses`);
      const licensesArray = ["None"];
      for (let license in licenses) {
        licensesArray.push(`${licenses[license].key.toUpperCase()}`);
      }
      return licensesArray;
    },
    validate: (input) => {
      if (input === "") {
        return "Choose valid license";
      }
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
