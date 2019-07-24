const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
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

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});

module.exports = app;
