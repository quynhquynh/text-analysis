const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors setup
app.use(cors());

app.post("/api/text", ({ body: { text } }, res) => {
  // accept empty string
  if (text === "") {
    return res.json({
      textLength: {
        withSpaces: 0,
        withoutSpaces: 0
      },
      wordCount: 0,
      characterCount: []
    });
  } else if (!text) {
    // string is either undefined, null, NaN or false
    return res
      .status(400)
      .json({ msg: "Must be a truthy value or empty string!" });
  } else {
    const alpRegex = /^[a-z\d\s.,]+$/gi;
    if (!alpRegex.test(text)) {
      return res
        .status(400)
        .json({ msg: "Must be English letters and numbers only!" });
    }
    const withSpaces = text.length;

    const textWithoutSpaces = text.replace(/\s/g, "");
    const withoutSpaces = textWithoutSpaces.length;

    const wordCount = text.trim().split(/\s+/g).length;

    // calculate character count
    const arrOfChars = textWithoutSpaces.toLowerCase().split("");
    const sortArr = arrOfChars.sort((a, b) => (a < b ? -1 : 1));
    const sortText = sortArr.join("");
    const characterCount = [],
      seen = {};
    for (let char of sortText) {
      if (!seen[char]) {
        if (/[a-z]/g.test(char)) {
          const regex = new RegExp(char, "g");
          const len = sortText.match(regex).length;
          characterCount.push({ [char]: len });
          seen[char] = true;
        }
      }
    }

    return res.json({
      textLength: { withSpaces, withoutSpaces },
      wordCount,
      characterCount
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`app listening on port ${port}`));
