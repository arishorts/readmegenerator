const https = require("https");

//uses https module to get the github API
async function getAPI(path) {
  const options = {
    hostname: "api.github.com",
    path: `${path}`,
    headers: {
      "User-Agent": "potential-enigma", // GitHub API requires a user-agent : repo header
    },
  };

  return new Promise((resolve, reject) => {
    https
      .get(options, (res) => {
        let data = "";

        res.on("data", (d) => {
          data += d;
        });

        res.on("end", () => {
          const repoObj = JSON.parse(data);
          resolve(repoObj);
        });
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
}

// returns a license badge based on which license is passed in
// If there is no license, returns an empty string
function renderLicenseBadge(license) {
  if (license.key == "unlicense") return "";
  return ` ![alt text](https://img.shields.io/badge/License-${license.key
    .replace(/-/g, "_")
    .toUpperCase()}-blue.svg)`;
  //return ` ![alt text](https://img.shields.io/github/license/${answers.userName}/${answers.repo})`;
}

// returns the license link
// If there is no license, returns an empty string
function renderLicenseLink(license) {
  if (license.key == "unlicense") return "";
  return `- [License](#license)`;
}

// returns the license section of README
// If there is no license, returns an empty string
async function renderLicenseSection(license) {
  if (license.key == "unlicense") return "";
  const licenseLink = license.html_url;
  return `## License:

  &nbsp; ${licenseLink}`;
}

// returns badges for all languages used in the repo
async function renderBadges(answers) {
  try {
    const languages = await getAPI(
      `/repos/${answers.userName}/${answers.repo}/languages`
    );
    const badges = []; // create an array to store badge strings
    let total = 0;
    for (let key in languages) {
      total += languages[key];
    }
    for (let language in languages) {
      badges.push(
        `![badmath](https://img.shields.io/badge/${language}-${Math.round(
          (languages[language] / total) * 100
        )}%25-purple)`
      );
    }
    return badges.join("\n");
  } catch (err) {
    console.log(err);
    return "";
  }
}

// generates markdown for README
async function generateMarkdown(answers) {
  const license = await getAPI(`/licenses/${answers.license}`);
  return `# ${answers.title}${renderLicenseBadge(license)}

  ## Description:
  
  &nbsp; ${answers.description}

  ## Table of Contents:
  
  - [Installation](#installation)
  - [Usage](#usage)
  - [Tests](#tests)
  - [Badges](#badges)
  - [How_to_Contribute](#how_to_contribute)
  - [Questions](#questions)
  ${renderLicenseLink(license)}

  ## Usage:
  
  &nbsp; The website can be found at: https://${answers.userName}.github.io/${
    answers.repo
  }/

  ## Tests:

  &nbsp; ${answers.tests}

  ## Badges:

  ${await renderBadges(answers)}

  ## How_to_Contribute:
  
  &nbsp; If you would like to contribute, refer to the [Contributor Covenant](https://www.contributor-covenant.org/)
  
  ## Questions:

  &nbsp; My GitHub profile can be found at: https://github.com/${
    answers.userName
  }
  <br>&nbsp; Reach me with additional questions at : ${answers.email}

  ${await renderLicenseSection(license)}

  ---
  
  © 2022 Ariel Schwartz LLC. Confidential and Proprietary. All Rights Reserved.
`;
}

module.exports = { generateMarkdown, getAPI };
