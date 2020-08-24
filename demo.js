// https://cloud.ibm.com/docs/visual-recognition?topic=visual-recognition-getting-started-tutorial&programming_language=javascript#getting-started-tutorial

const fs = require('fs');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  authenticator: new IamAuthenticator({
    apikey: 'replace_with_your_watson_vr_api_key',
  }),
  url: 'replace_with_your_watson_vr_url',
});

const classifyParams = {
  url: 'https://ibm.biz/BdzLPG',
};

visualRecognition.classify(classifyParams)
  .then(response => {
    const classifiedImages = response.result;
    console.log(JSON.stringify(classifiedImages, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });
