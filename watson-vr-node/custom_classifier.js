// https://cloud.ibm.com/apidocs/visual-recognition/visual-recognition-v3?code=node#getclassify

"use strict"

const path = require('path');
const fs = require('fs');

if (!process.argv[2]) {
  console.error("Usage: " + path.basename(process.argv[1]) + " <filename> [treshold]");
  return (-1);
}

const filename = process.argv[2];
if (!fs.existsSync(filename)) {
  console.error('File ' + filename + ' not found!');
  return -1
}

const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const resultsPath = './results/';
const treshold = process.argv[3] ? process.argv[3] : 0.5;
const config = getConfig();

if (config == null) return -1;

const visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  authenticator: new IamAuthenticator({
    apikey: config.credentials.apikey,
  }),
  url: config.credentials.url
});

const classifyParams = {
  imagesFile: fs.createReadStream(filename),
  classifierIds: config.classifierIds,
  threshold: treshold
};

const resultsFile = resultsPath + 'results_' + getISODate(new Date()) + ".json";

console.log("File to classify: " + filename);
console.log("Classifying treshold = " + treshold);

visualRecognition.classify(classifyParams)
  .then(response => {
    const classifiedImages = response.result;
    fs.writeFileSync(resultsFile, JSON.stringify(classifiedImages, null, 2));
    console.log("Classification finished. See " + resultsFile + " for the results.");
  })
  .catch(err => {
    console.log('error:', err);
  });


function getConfig() {

  const configFile = './config/wvr_config.json';
  const errorMessage = 'Please fix ' + configFile + ' configuration file.'

  try {

    const data = fs.readFileSync(configFile);
    const config = JSON.parse(data);

    if (!config.hasOwnProperty('credentials')) {
      console.error('Missing "credentials" property. ' + errorMessage);
      return null;
    }

    if (!config.hasOwnProperty('classifierIds')) {
      console.error('Missing "classifierIds" property. ' + errorMessage);
      return null;
    }

    const credentials = config.credentials;
    const classifierIds = config.classifierIds;

    if (!credentials.hasOwnProperty('apikey') || !credentials.apikey) {
      console.error('Missing "apikey" information. ' + errorMessage);
      return null;
    }

    if (!credentials.hasOwnProperty('url') || !credentials.url) {
      console.error('Missing "url" information. ' + errorMessage);

      return null;
    }

    if (!classifierIds || classifierIds.length == 0) {
      console.error('Missing claasifier IDs. information. ' + errorMessage);
      return null;
    }

    return config;

  } catch (err) {

    if (err.code === 'ENOENT') {
      console.log('File ' + configFile + ' not found!');
    } else {
      throw err;
    }

  }

}

function getISODate(date) {
  return (date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + "-" +
    ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2));
}