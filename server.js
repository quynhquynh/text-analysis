const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const analyzeText = require("./controllers");

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors setup
app.use(cors());

app.post("/api/text", analyzeText);

app.use((err, req, res, next) => {
  if (err.message) {
    return res.status(400).json({
      msg: err.message
    });
  } else {
    return res.status(500).json({
      msg: "Internal Error"
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`app listening on port ${port}`));
