module.exports = ({ body: { text = "" } }, res, next) => {
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
  } else {
    const alpRegex = /^[a-z\d\s.,]+$/gi;

    // text got incorrect format
    if (!alpRegex.test(text)) {
      const e = new Error(
        "Only accept English letters, numbers, spaces, commas and periods!"
      );
      return next(e);
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
};
