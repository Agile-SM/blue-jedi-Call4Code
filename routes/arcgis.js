"use strict";

let express = require("express");
let router = express.Router();
let request = require('request');
const options = { method: 'POST',
        url: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute',
        headers: 
        { 'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'content-length': '1821',
            'accept-encoding': 'gzip, deflate',
            Host: 'utility.arcgisonline.com',
            'Postman-Token': '531ad421-32e0-4773-a27c-5ae3d5078865,b5da603c-afad-43bc-bc51-1edf2e87d25e',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.15.0',
            'Content-Type': 'application/x-www-form-urlencoded' },
        form: 
        { f: 'json',
            Format: 'PNG32',
            Layout_Template: 'MAP_ONLY',
            Web_Map_as_JSON: '{\n\t"mapOptions": {\n\t\t"extent": {\n  "xmin":-10396000,\n  "ymin":1535000,\n  "xmax":-9926000,\n  "ymax":1706000,\n  "spatialReference" : {\n   "wkid" : 102100\n  }\n\t\t}\n\t},\n\t"operationalLayers": [{\n\t\t"type": "CSV",\n\t\t"url": "http://servicesbeta.esri.com/demos/exp/data/earthquakes.csv",\n\t\t"id": "Earthquakes",\n\t\t"title": "Earthquakes",\n\t\t"visibility": true,\n\t\t"opacity": 1,\n\t\t"layerDefinition": {\n\t\t\t"drawingInfo": {\n\t\t\t\t"renderer": {\n\t\t\t\t\t"symbol": {\n\t\t\t\t\t\t"height": 15,\n\t\t\t\t\t\t"type": "esriPMS",\n\t\t\t\t\t\t"url": "http://static.arcgis.com/images/Symbols/Basic/RedSphere.png",\n\t\t\t\t\t\t"width": 15\n\t\t\t\t\t},\n\t\t\t\t\t"type": "simple"\n\t\t\t\t},\n\t\t\t\t"transparency": 0\n\t\t\t}\n\t\t},\n\t\t"locationInfo": {\n\t\t\t"latitudeFieldName": "lat",\n\t\t\t"longitudeFieldName": "lon"\n\t\t}\n\t}],\n\t"baseMap": {\n\t\t"title": "Topographic Basemap",\n\t\t"baseMapLayers": [{\n\t\t\t"url": "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"\n\t\t}]\n\t},\n\t"exportOptions": {\n\t\t"outputSize": [700, 400]\n\t}\n}' } };
 
// ROUTES //
router.get("/", (req, res) => {
    request(options, function(error, response, body) {
        console.log("EL BODY", JSON.parse(body).results[0].value.url)
    });
});

module.exports = router;
