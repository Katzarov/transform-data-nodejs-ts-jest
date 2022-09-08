import { generateStats, StatsType } from "./main";
import { TrackDataType } from "./generateData";

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

describe("generateStats", (): void => {
    it.each`
    tracks                       | computedStatistics | inputDescription
    ${[]}                        | ${{}}              | ${"no tracks"}
    ${[input1]}                  | ${expected1}       | ${"one track"}
    ${[input2, input22]}         | ${expected2}       | ${"two tracks same genres, diff subgenres"}
    ${[input1, input2, input22]} | ${expected3}       | ${"three tracks different genres"}
  `(
        'returns an object with correctly computed statistics for "$inputDescription"',
        ({ tracks, computedStatistics }): void => {
            expect(generateStats(tracks)).toStrictEqual(computedStatistics);
        }
    );
});
