"use strict";

const path = require('path');
const fs = require('fs');

if (!process.argv[2]) {
  console.error("Usage: " + path.basename(process.argv[1]) + " <filename>");
  return (-1);
}

const resultsFile = process.argv[2];
if (!fs.existsSync(resultsFile)) {
  console.error('File ' + resultsFile + ' not found!');
  return -1
}

let totalRight = 0;
let totalWrong = 0;
let totalMaybe = 0;
let classifications = {good: [], bad: []};

fs.readFile(resultsFile, (err, data) => {
    if (err) throw err;
    let results = JSON.parse(data);
    results.images.forEach(result => {
        let filename = result.image.substring(result.image.indexOf('/') + 1)
        let expectedRecognition = parseInt(filename[0]) == 1 ? true : false;
        let expectedClass = filename.split("-")[1] ? filename.split("-")[1] : null;
        if (result.classifiers[0].classes.length > 0) {
            for (let i = 0; i < result.classifiers[0].classes.length; ++i) {
                let classification = result.classifiers[0].classes[i];
                if (i == 0) {
                    if (rightOrWrong(expectedClass, classification.class)) {
                        saveClassification (filename, expectedClass, classification.class, classification.score, true);
                        totalRight += 1;
                    } else {
                        totalWrong += 1;
                        saveClassification (filename, expectedClass, classification.class, classification.score, false);
                    }
                } else {
                    totalMaybe += 1;
                }
            }
        } else {
            if (rightOrWrong(expectedClass, null)) {
                totalRight += 1;
                saveClassification (filename, "Negative", "Negative", "None", true);
            } else {
                totalWrong += 1;
                saveClassification (filename, expectedClass, "Negative", "None", false);
            }
        }
    });
    let totalClassified = totalRight + totalWrong + totalMaybe;

    console.log('Right: ' + totalRight + ' out of ' + totalClassified);
    classifications["good"].forEach(classification => {
        console.log(classification.filename + ": classified as [" + classification.classifiedClass + "], score: " + classification.score);
    }); 

    console.log('\nWrong: ' + totalWrong + ' out of ' + totalClassified);
    classifications["bad"].forEach(classification => {
        console.log(classification.filename + ": expected [" + classification.expectedClass + "], classified as [" + classification.classifiedClass + "], score: " + classification.score);
    });
    if (totalMaybe) console.log('Maybe: ' + totalMaybe + 'out of ' + totalClassified);
    console.log('\n');
});

function rightOrWrong (expectedClass, classifiedClass) {
    return (expectedClass == classifiedClass);
}

function saveClassification (filename, expectedClass, classifiedClass, score, good) {
    let goodOrBad = good ? "good" : "bad";
    classifications[goodOrBad].push({filename: filename, 
                                     expectedClass: expectedClass, 
                                    classifiedClass: classifiedClass, 
                                    score: score});
}