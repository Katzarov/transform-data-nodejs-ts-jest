import {
    generateStats,
    updatePlayCountArrAndGetNewMax,
    StatsType,
} from "./main";
import { TrackDataType } from "./generateData";

describe("Generated stats", () => {
    it("returns an object with valid shape and correct counts", () => {
        expect(generateStats([])).toStrictEqual({});
        expect(generateStats([input1])).toStrictEqual(expected1);
        expect(generateStats([input2, input22])).toStrictEqual(expected2);
        expect(generateStats([input1, input2, input22])).toStrictEqual(expected3);
    });
});

describe("Helpers functions", () => {
    test("does not mutate the currentTrack param", () => {
        const input1: TrackDataType = {
            name: "Random Name",
            genre: "Blues",
            subGenre: "12-bar",
            playCount: 10,
            tags: ["slow"],
        };

        // const expected1: StatsType = {
        //     totalPlayCountOfAllTracks: 10,
        //     mostPlayedGenreName: "Blues",
        //     mostPlayedGenrePlayCount: 10,
        // };

        // can we test if helper function mutates the currentTrack object ref or contents ?
        // expect(updatePlayCountArrAndGetNewMax({}, input1)).
    });
});

const input1: TrackDataType = {
    name: "Random Name",
    genre: "Blues",
    subGenre: "12-bar",
    playCount: 10,
    tags: ["slow"],
};

const expected1: StatsType = {
    totalPlayCountOfAllTracks: 10,
    mostPlayedGenreName: "Blues",
    mostPlayedGenrePlayCount: 10,
    moreDetailsByGenre: [
        {
            genre: "Blues",
            totalPlayCountOfGenre: 10,
            subGenres: [
                {
                    genre: "12-bar",
                    totalPlayCountOfGenre: 10,
                },
            ],
        },
    ],
};

const input2: TrackDataType = {
    name: "Random Name",
    genre: "Jazz",
    subGenre: "free",
    playCount: 20,
    tags: ["slow"],
};

const input22: TrackDataType = {
    name: "Random Name",
    genre: "Jazz",
    subGenre: "bepop",
    playCount: 30,
    tags: ["slow"],
};

const expected2: StatsType = {
    totalPlayCountOfAllTracks: 50,
    mostPlayedGenreName: "Jazz",
    mostPlayedGenrePlayCount: 50,
    moreDetailsByGenre: [
        {
            genre: "Jazz",
            totalPlayCountOfGenre: 50,
            subGenres: [
                {
                    genre: "free",
                    totalPlayCountOfGenre: 20,
                },
                {
                    genre: "bepop",
                    totalPlayCountOfGenre: 30,
                },
            ],
        },
    ],
};

const expected3: StatsType = {
    totalPlayCountOfAllTracks: 60,
    mostPlayedGenreName: "Jazz",
    mostPlayedGenrePlayCount: 50,
    moreDetailsByGenre: [
        {
            genre: "Blues",
            totalPlayCountOfGenre: 10,
            subGenres: [
                {
                    genre: "12-bar",
                    totalPlayCountOfGenre: 10,
                },
            ],
        },
        {
            genre: "Jazz",
            totalPlayCountOfGenre: 50,
            subGenres: [
                {
                    genre: "free",
                    totalPlayCountOfGenre: 20,
                },
                {
                    genre: "bepop",
                    totalPlayCountOfGenre: 30,
                },
            ],
        },
    ],
};
