
let express = require("express");
let router = express.Router();
let request = require("request");

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'pbof7Ur8a862IlebcGm-hbHL5vacXRFllScEMvan_iXP',
  disable_ssl_verification: true
});
/* curl -X POST -u "apikey:pbof7Ur8a862IlebcGm-hbHL5vacXRFllScEMvan_iXP" -F "negative_examples=@floods.zip" "https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers/tornados_1968511731?version=2018-03-19" */
//TO CREATE curl -X POST -u "apikey:pbof7Ur8a862IlebcGm-hbHL5vacXRFllScEMvan_iXP" -F "floods_positive_examples=@floods.zip" -F "negative_examples=@normal.zip" -F "name=floods" "https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers?version=2018-03-19"

router.get("/classify", (req, res) => {
    const classifyParams = {
        images_file: fs.createReadStream('./2017-09-15.jpg'),
        owners: ['me'],
        threshold: 0.6,
        classifier_ids: 'floods_1890333522'
    };
    visualRecognition.classify(classifyParams).then(classifiedImages => {
        console.log(JSON.stringify(classifiedImages, null, 2));
    }).catch(err => {
        console.log('error:', err);
    });
});

router.get("/", (req, res) => {
    visualRecognition.listClassifiers({verbose: true}, function(err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log(JSON.stringify(response, null, 2))
        }
      });
});

router.get("/delete", (req, res) => {
    let id = req.body.id;
    visualRecognition.deleteClassifier({classifier_id: id}, function(err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log(JSON.stringify(response, null, 2))
        }
      });
});

module.exports = router;
