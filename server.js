const express = require("express"),
  cors = require("cors"),
  bodyParser = require('body-parser'),
  appEnv = require("cfenv").getAppEnv(),
  app = express();

app.use(cors());

// Routes
/* let router = express.Router(); */
app.use("/api/dashboard", require("./routes/dashboard"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* app.use("/api", router); */
/* app.use(express.json());


/* app.listen(port, () => { */
app.listen(appEnv.port, appEnv.bind, () => {
  console.log(`App listening on http://localhost:${appEnv.port}`);
});

module.exports = app;
