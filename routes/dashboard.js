"use strict";

let express = require("express");
let router = express.Router();
let Cloudant = require('@cloudant/cloudant');
let cloudant = Cloudant({ account: '05f8b47b-7a7b-4252-a0c3-3dffb7a7b2de-bluemix', password: 'cf2cd0758e5a31fc436f2de98b1bf0254fc2d214df2eb48d8fc988becaa623b4' });
let db = cloudant.db.use('disaster-prevention');
let request = require('request');

// ROUTES //
router.get("/", async (req, res) => {
    
    var request = require('request');

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Yng6Yng='
    };

    var dataString = 'apikey=LX9J-lZlxHAVaieihn8N7DHGVKb5CaBnS79sUMlUtr5M&grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey';

    var optionsToken = {
        url: 'https://iam.bluemix.net/identity/token',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    async function callbackToken(error, response, body) {
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(body).access_token,
            'ML-Instance-ID': '44d787cb-e870-4023-8bba-7f10749749fb'
        };
        //EARTHQUAKE
        const EARTHQUAKE = await watsonStudio('{"fields": ["AIRSPEED", "FLOOD WARNING", "WATER QUALITY", "SOLIDS", "CONDUCTIVITY", "pH", "FECAL COLIFORMS", "GROWTH LEVEL", "TORNADO", "FLOOD"], "values": [[143.87,18.16,75.5,88.96,907.05, 11.81, 7334.16, 3.89, "false", "false"]]}', headers)
        // FLOOD
        const FLOOD = await watsonStudio('{"fields": ["AIRSPEED", "FLOOD WARNING", "WATER QUALITY", "SOLIDS", "CONDUCTIVITY", "pH", "FECAL COLIFORMS", "GROWTH LEVEL", "TORNADO", "EARTHQUAKE"], "values": [[143.87,18.16,75.5,88.96,907.05, 11.81, 7334.16, 3.89, "false", "false"]]}', headers)
        // TORNADO
        const TORNADO = await watsonStudio('{"fields": ["AIRSPEED", "FLOOD WARNING", "WATER QUALITY", "SOLIDS", "CONDUCTIVITY", "pH", "FECAL COLIFORMS", "GROWTH LEVEL", "EARTHQUAKE", "FLOOD"], "values": [[143.87,18.16,75.5,88.96,907.05, 11.81, 7334.16, 3.89, "false", "false"]]}', headers)
        db.find({selector: {date: req.query.date}}).then((body) => {
            res.json({docs: body.docs, machine_learning: {earthquake: EARTHQUAKE.values[0][12][0], flood: FLOOD.values[0][12][0], tornado: TORNADO.values[0][12][0]}});
        }).catch((error) => { 
            res.json({error: error})    
        });
    }
    request(optionsToken, callbackToken);
   
}); 

function watsonStudio(data, headers) {
    return new Promise((resolve, reject) => {
        
        var options = {
            url: 'https://eu-gb.ml.cloud.ibm.com/v3/wml_instances/44d787cb-e870-4023-8bba-7f10749749fb/deployments/d77ced64-8f1a-4b21-92a7-91e367db77b7/online',
            method: 'POST',
            headers: headers,
            body: data
        };
        
        function callback(error, response, body) {
            if (body) {
                resolve(JSON.parse(body));
            } else {
                reject();
            }
        }
        request(options, callback);
    })
};
module.exports = router;
