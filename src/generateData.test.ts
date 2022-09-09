import { generateData, generateDataAsync, TrackDataType } from "./generateData";

beforeAll(() => {
  // used to select random array entries, this way always the first element should be selected
  jest.spyOn(global.Math, "random").mockReturnValue(0);
  // investigate: read somewhere that original function may still be executed ? anyway, in this case no unwanted side effects are produced.
});
afterAll(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

// TODO: do we test stuff for example is strings are passed ? Anyhting can happen at runtime even tho TS helps.
describe("Data generator", () => {
  it("throws an error when invalid arguments are passed.", async () => {
    const error = new Error("Number of entires must be a non-negative number");
    expect(() => generateData(-1)).toThrowError(error);
    await expect(generateDataAsync(-1)).rejects.toThrowError(error);
  });

  it("returns array of objects with valid shape.", () => {
    const expected: TrackDataType = {
      name: "Random Name",
      genre: "Blues",
      subGenre: "12-bar",
      playCount: 0,
      tags: ["slow"],
    };
    // TODO: should probably do table tests like in main.test
    expect(generateData(0)).toStrictEqual([]);
    expect(generateData(1)).toStrictEqual([expected]);
    expect(generateDataAsync(1)).resolves.toStrictEqual([expected]); // TODO passes without async await
    expect(generateData(2)).toStrictEqual([expected, expected]);
  });

  it("returns the correct number of objects in an arraty.", () => {
    expect(generateData(0).length).toBe(0);
    expect(generateData(3).length).toBe(3);
    expect(generateData(100000).length).toBe(100000);
  });
});
