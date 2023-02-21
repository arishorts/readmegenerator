const https = require("https");

async function getAPI(path) {
  const options = {
    hostname: "api.github.com",
    path: `${path}`,
    headers: {
      "User-Agent": "potential-enigma", // GitHub API requires a user-agent header
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

// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license) {
  return ` ![alt text](https://img.shields.io/github/license/${license.userName}/${license.repo})`;
}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(licenseObj) {
  return `${licenseObj.html_url}`;
}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
async function renderLicenseSection(answers) {
  const licenseObj = await getAPI(`/licenses/${answers.license}`);
  const licenseLink = renderLicenseLink(licenseObj);
  const licenseBadges = renderLicenseBadge(answers);
  return `${licenseLink}
  
  ${licenseBadges}`;
}

async function renderBadges(data) {
  const languages = await getAPI(
    `/repos/${data.userName}/${data.repo}/languages`
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
}

// TODO: Create a function to generate markdown for README
async function generateMarkdown(answers) {
  //const info = await getAPI(`/repos/${answers.userName}/${answers.repo}`);
  return `# ${answers.repo}

  # myWeatherService

  ## Description
    
  ### User Story:
  
  ### New Skills:
  
  ## Table of Contents:
  
  ## Usage:
  
  The website can be found at: https://${answers.userName}.github.io/${
    answers.repo
  }/
  
  ![alt text](./assets/images/usage.JPG)
  
  ## Badges:

  ${await renderBadges(answers)}

  ## How_to_Contribute:
  
  If you would like to contribute, refer to the [Contributor Covenant](https://www.contributor-covenant.org/)
  
  ## Credits:
  
  
  ## License:

  ${await renderLicenseSection(answers)}

  ---
  
  © 2022 Ariel Schwartz LLC. Confidential and Proprietary. All Rights Reserved.
`;
}

module.exports = { generateMarkdown, getAPI };
