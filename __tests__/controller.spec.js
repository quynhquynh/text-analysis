const analyzeText = require("../controllers");

describe("analyze text func", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = {
    json: jest.fn()
  };
  const next = jest.fn();
  describe("text is falsy value", () => {
    it("should assign default value as empty text string and return all 0 and empty values when text is undefined", () => {
      expect.assertions(2);
      const text = undefined;
      const req = { body: { text } };
      analyzeText(req, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          textLength: expect.objectContaining({
            withSpaces: 0,
            withoutSpaces: 0
          }),
          wordCount: 0,
          characterCount: expect.arrayContaining([])
        })
      );
    });
    it("should return all 0 and empty values when empty string is passed", () => {
      expect.assertions(1);
      const text = "";
      const req = { body: { text } };
      analyzeText(req, res, next);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          textLength: expect.objectContaining({
            withSpaces: 0,
            withoutSpaces: 0
          }),
          wordCount: 0,
          characterCount: expect.arrayContaining([])
        })
      );
    });
  });
  describe("text is truthy value", () => {
    it("text not match regex", () => {
      const text = "_";
      const req = { body: { text } };
      analyzeText(req, res, next);
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
    describe("text match regex", () => {
      it("should return obj with calculated values when text contains letters, spaces and symbols", () => {
        expect.assertions(1);
        const text = "a,. ";
        const req = { body: { text } };
        analyzeText(req, res, next);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            textLength: expect.objectContaining({
              withSpaces: 4,
              withoutSpaces: 3
            }),
            wordCount: 1,
            characterCount: expect.arrayContaining([
              expect.objectContaining({ a: 1 })
            ])
          })
        );
      });
      it("should return calculated values with characterCount does not include numbers when text contains letters, spaces, symbols and numbers", () => {
        expect.assertions(1);
        const text = "a,. 1";
        const req = { body: { text } };
        analyzeText(req, res, next);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            textLength: expect.objectContaining({
              withSpaces: 5,
              withoutSpaces: 4
            }),
            wordCount: 2,
            characterCount: expect.arrayContaining([
              expect.objectContaining({ a: 1 })
            ])
          })
        );
      });
      it("should return calculated values when text contains trailing spaces", () => {
        expect.assertions(1);
        const text = "a  ";
        const req = { body: { text } };
        analyzeText(req, res, next);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            textLength: expect.objectContaining({
              withSpaces: 3,
              withoutSpaces: 1
            }),
            wordCount: 1,
            characterCount: expect.arrayContaining([
              expect.objectContaining({ a: 1 })
            ])
          })
        );
      });
    });
  });
});
