const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  appEnv = require("cfenv").getAppEnv(),
  app = express();

app.use(cors());

// Routes
let router = express.Router();
router.use("/dashboard", require("./routes/dashboard"));
/* router.use("/cron", require("./routes/cron")); */

// all routes will be prefixed with /api
app.use("/api", router);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* app.listen(port, () => { */
app.listen(appEnv.port, appEnv.bind, () => {
  console.log(`App listening on http://localhost:${appEnv.port}`);
});

module.exports = app;
