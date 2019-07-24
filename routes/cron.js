'use strict';

let express = require('express');
let router = express.Router();
let request = require('request');
let moment = require('moment');
let download = require('image-downloader');
let fs = require('fs');
let cron = require('node-cron');
const uuidv4 = require('uuidv4');
let VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'pbof7Ur8a862IlebcGm-hbHL5vacXRFllScEMvan_iXP',
  disable_ssl_verification: true
});

let Cloudant = require('@cloudant/cloudant');
let cloudant = Cloudant({
  account: '05f8b47b-7a7b-4252-a0c3-3dffb7a7b2de-bluemix',
  password: 'cf2cd0758e5a31fc436f2de98b1bf0254fc2d214df2eb48d8fc988becaa623b4'
});
let db = cloudant.db.use('disaster-prevention');
let localPath = __dirname + '../../../../assets/img/download_cron/';

const options = {
  method: 'POST',
  url:
    'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute',
  headers: {
    'cache-control': 'no-cache',
    Connection: 'keep-alive',
    'content-length': '1828',
    'accept-encoding': 'gzip, deflate',
    Host: 'utility.arcgisonline.com',
    'Postman-Token':
      'fb0b9d01-faf0-40bf-97c5-eeaf8163fadf,0b0e85ed-e733-414b-b759-fdb8eb99d6d7',
    'Cache-Control': 'no-cache',
    Accept: '*/*',
    'User-Agent': 'PostmanRuntime/7.15.0',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    f: 'json',
    Format: 'PNG32',
    Layout_Template: 'MAP_ONLY',
    Web_Map_as_JSON:
      '{\n\t"mapOptions": {\n\t\t"extent": {\n  "xmin":-10396000,\n  "ymin":1535000,\n  "xmax":-9926000,\n  "ymax":1706000,\n  "spatialReference" : {\n   "wkid" : 102100\n  }\n\t\t}\n\t},\n\t"operationalLayers": [{\n\t\t"type": "CSV",\n\t\t"url": "http://servicesbeta.esri.com/demos/exp/data/earthquakes.csv",\n\t\t"id": "Earthquakes",\n\t\t"title": "Earthquakes",\n\t\t"visibility": true,\n\t\t"opacity": 1,\n\t\t"layerDefinition": {\n\t\t\t"drawingInfo": {\n\t\t\t\t"renderer": {\n\t\t\t\t\t"symbol": {\n\t\t\t\t\t\t"height": 15,\n\t\t\t\t\t\t"type": "esriPMS",\n\t\t\t\t\t\t"url": "http://static.arcgis.com/images/Symbols/Basic/RedSphere.png",\n\t\t\t\t\t\t"width": 15\n\t\t\t\t\t},\n\t\t\t\t\t"type": "simple"\n\t\t\t\t},\n\t\t\t\t"transparency": 0\n\t\t\t}\n\t\t},\n\t\t"locationInfo": {\n\t\t\t"latitudeFieldName": "lat",\n\t\t\t"longitudeFieldName": "lon"\n\t\t}\n\t}],\n\t"baseMap": {\n\t\t"title": "Topographic Basemap",\n\t\t"baseMapLayers": [{\n\t\t\t"url": "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"\n\t\t}]\n\t},\n\t"exportOptions": {\n\t\t"outputSize": [700, 400]\n\t}\n}'
  }
};

// ROUTES //

cron.schedule('0 0 12 * * *', () => {
  request(options, async (error, response, body) => {
    let listId = uuidv4();
    const result = {
      _id: listId,
      id: listId,
      url: JSON.parse(body).results[0].value.url,
      airspeed: random(0, 200),
      flood: random(0, 60),
      water_quality: random(0, 100),
      solids: random(0, 100),
      conductivity: random(0, 1000),
      ph: random(1, 14),
      fecal_coliforms: random(0, 20000),
      glowth_level: random(0, 6),
      date: moment().format('YYYY-MM-DD'),
      created_at: new Date
    };
    let vr = await classifyVisualRecognition(JSON.parse(body).results[0].value.url, moment().format('YYYY-MM-DD'));
    result.visual_recognition_score = vr;
    db.insert(result)
      .then(body => { 
        console.log("OK")
       })
      .catch(error => {
        console.log('ERROR', error);
      });
  });
});

function random(low, high) {
  return Math.random() * (high - low) + low;
};

function classifyVisualRecognition(url, name) {
    return new Promise((resolve, reject) => {
      const options = {
        url: url,
        dest: localPath + name + '.jpg'
      }
       
      download.image(options)
        .then(({ filename, image }) => {
        const classifyParams = {
          images_file: image,
          owners: ['me'],
          threshold: 0.6,
          classifier_ids: 'floods_1890333522,tornados_1968511731'
        };
        visualRecognition.classify(classifyParams).then(classifiedImages => {
          if (classifiedImages.images_processed > 0) {
            let classifiers = {};
            for (let i = 0; i < classifiedImages.images[0].classifiers.length; i++) { 
              classifiers[classifiedImages.images[0].classifiers[i].name] = null;
              if (classifiedImages.images[0].classifiers[i].classes.length > 0) {
                classifiers[classifiedImages.images[0].classifiers[i].name] = classifiedImages.images[0].classifiers[0].classes[0].score;
              }
            }
            resolve(classifiers);
          } else {
            resolve({});
          }
        }).catch(err => {
            console.log('error:', err);
        });
        })
        .catch((err) => {
          console.error(err)
        })
    })
};

module.exports = router;
