const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  appEnv = require("cfenv").getAppEnv(),
  app = express();

  app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
let router = express.Router();

router.use("/iot", require("./routes/iot"));
router.use("/arcgis", require("./routes/arcgis"));
router.use("/dashboard", require("./routes/dashboard"));
router.use("/cron", require("./routes/cron"));
router.use("/vr", require("./routes/visual-recognition"));

// all routes will be prefixed with /api
app.use("/api", router);

app.use(express.json());

const port = process.env.PORT || 3000;

/* app.listen(port, () => { */
app.listen(appEnv.port, appEnv.bind, () => {
  console.log(`App listening on http://localhost:${appEnv.port}`);
});

module.exports = app;
