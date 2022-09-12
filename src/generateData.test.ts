import { generateData, generateDataAsync, TrackDataType } from "./generateData";

// TODO: In general: do we test stuff like for example, if a string is passed as param where a number is expected. ?
// ..stuff can still go wrong at runtime even tho TS aims to solve this, - at least withing our project we can know if its type safe - but when other 3rd party code is involved - that may not even be using TS ?
describe("Data generator with mocked random", () => {
  beforeAll(() => {
    // used to select random entries from the array, this way we always select the first element.
    jest.spyOn(global.Math, "random").mockReturnValue(0);
    // TODO: read somewhere that original function may still be executed ? anyway, in this case no unwanted side effects are produced.
  });
  afterAll(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("throws an error when invalid arguments are passed.", async () => {
    const error = new Error("Number of entires must be a non-negative number");
    expect(() => generateData(-1)).toThrowError(error);
    await expect(generateDataAsync(-1)).rejects.toThrowError(error);
  });

  it("returns array of objects with valid shape and values.", async () => {
    const expected: TrackDataType = {
      name: "Random Name",
      genre: "Blues",
      subGenre: "12-bar",
      playCount: 0,
      tags: ["slow"],
    };
    expect(generateData(0)).toStrictEqual([]);
    expect(generateData(1)).toStrictEqual([expected]);
    expect(generateData(2)).toStrictEqual([expected, expected]);

    await expect(generateDataAsync(0)).resolves.toStrictEqual([]);
    await expect(generateDataAsync(1)).resolves.toStrictEqual([expected]);
    await expect(generateDataAsync(2)).resolves.toStrictEqual([
      expected,
      expected,
    ]);
  });
});

describe("Data generator", () => {
  it("returns the correct number of objects in an arraty.", () => {
    expect(generateData(0).length).toBe(0);
    expect(generateData(3).length).toBe(3);
    expect(generateData(100000).length).toBe(100000);
  });
  // TODO; see if any smart way to validate if the resulting object has the expected properties on the object without caring about the values,
  // i.e the object produced from the dataGenerator is in the correct shape.
});
