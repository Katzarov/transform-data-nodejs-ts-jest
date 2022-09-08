import { generateData, TrackDataType } from "./generateData";

beforeAll(() => {
  // used to select random array entries, this way always the first element should be selected
  jest.spyOn(global.Math, "random").mockReturnValue(0);
  // investigate: read somewhere that original function may still be executed ? anyway, in this case no unwanted side effects are produced.
});
afterAll(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

describe("Data generator", () => {
  it("returns empty array with invalid params. (well, at least at compile time invalid)", () => {
    expect(generateData(0)).toStrictEqual([]);
    expect(generateData(-1)).toStrictEqual([]);
    // hmm, is TS useful here if we want to test something that can go wrong at runtime ?
    // expect(generateData("fefef")).toStrictEqual([]);
  });

  it("returns array of objects with valid shape.", () => {
    const expected: TrackDataType = {
      name: "Random Name",
      genre: "Blues",
      subGenre: "12-bar",
      playCount: 0,
      tags: ["slow"],
    };
    expect(generateData(1)).toStrictEqual([expected]);
    expect(generateData(2)).toStrictEqual([expected, expected]);
  });

  it("returns the correct number of objects in an arraty.", () => {
    const expected: TrackDataType = {
      name: "Random Name",
      genre: "Blues",
      subGenre: "12-bar",
      playCount: 0,
      tags: ["slow"],
    };
    expect(generateData(3).length).toBe(3);
    expect(generateData(100000).length).toBe(100000);
  });
});
