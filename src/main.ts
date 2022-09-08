import { generateData, TrackDataType } from "./generateData";

// type TagStatsType = {
//     name: string;
//     count: number;
// };

interface GenreStatsType {
    genre: string;
    totalPlayCountOfGenre: number;
    // tagsStats: Array<TagStatsType>;
}

// if we only go so deep, scrap that and just type it more appropriately : nested obj : genre => subgenre
// this implies we can handle recursiveness but we dont
interface GenreAndSubGenresStatsType extends GenreStatsType {
    subGenres?: Array<GenreAndSubGenresStatsType>;
}

export interface StatsType {
    totalPlayCountOfAllTracks: number;
    mostPlayedGenreName: string;
    mostPlayedGenrePlayCount: number;
    moreDetailsByGenre: Array<GenreAndSubGenresStatsType>;
}
// TODO any runtime validation on the data ? or we assume contract

type playCountArrType = {
    [key: string]: number;
};

export function generateStats(tracks: Array<TrackDataType>): StatsType {
    const statsInitialValue: StatsType = {} as StatsType; // TODO: just init the obj here with first entry
    const playCountArr: playCountArrType = {};

    return tracks.reduce((stats: StatsType, track: TrackDataType): StatsType => {
        // total count
        if (stats.totalPlayCountOfAllTracks === undefined) {
            stats.totalPlayCountOfAllTracks = track.playCount;
        } else {
            stats.totalPlayCountOfAllTracks =
                stats.totalPlayCountOfAllTracks + track.playCount;
        }
        const { mostPlayedGenreName, mostPlayedGenrePlayCount } =
            updatePlayCountArrAndGetNewMax(playCountArr, track);

        //TODO test if mutated
        stats.mostPlayedGenreName = mostPlayedGenreName;
        stats.mostPlayedGenrePlayCount = mostPlayedGenrePlayCount;

        // init case
        const { genre, subGenre, playCount } = track;

        if (stats.moreDetailsByGenre === undefined) {
            const genreEntry: GenreAndSubGenresStatsType = {
                genre: genre,
                totalPlayCountOfGenre: playCount,
            };
            if (subGenre) {
                const subGenreEntry: GenreAndSubGenresStatsType = {
                    genre: subGenre,
                    totalPlayCountOfGenre: playCount,
                };
                genreEntry.subGenres = [subGenreEntry];
            }
            stats.moreDetailsByGenre = [genreEntry];

            return stats;
        }

        const genreEntryRef = stats.moreDetailsByGenre.find(
            (entry) => entry.genre === track.genre
        );

        if (genreEntryRef) {
            genreEntryRef.totalPlayCountOfGenre =
                genreEntryRef.totalPlayCountOfGenre + track.playCount;

            if (genreEntryRef.subGenres) {
                const subGenreEntryRef = genreEntryRef.subGenres.find(
                    (entry) => entry.genre === track.subGenre
                );

                if (subGenreEntryRef) {
                    subGenreEntryRef.totalPlayCountOfGenre = track.playCount;
                } else {
                    const newSubGenreEntry: GenreAndSubGenresStatsType = {
                        genre: track.subGenre,
                        totalPlayCountOfGenre: track.playCount,
                    };
                    genreEntryRef.subGenres.push(newSubGenreEntry);
                }
            }
        } else {
            const genreEntry: GenreAndSubGenresStatsType = {
                genre: genre,
                totalPlayCountOfGenre: playCount,
            };
            if (subGenre) {
                const subGenreEntry: GenreAndSubGenresStatsType = {
                    genre: subGenre,
                    totalPlayCountOfGenre: playCount,
                };
                genreEntry.subGenres = [subGenreEntry];
            }
            stats.moreDetailsByGenre.push(genreEntry);
        }

        return stats;
    }, statsInitialValue);
}

/**
 * @modifies {playCountArr}
 */
export function updatePlayCountArrAndGetNewMax(
    playCountArrRef: playCountArrType,
    track: TrackDataType
) {
    if (playCountArrRef[track.genre] === undefined) {
        playCountArrRef[track.genre] = track.playCount;
    } else {
        playCountArrRef[track.genre] =
            playCountArrRef[track.genre] + track.playCount;
    }

    let mostPlayedGenreName!: string;
    let mostPlayedGenrePlayCount!: number;
    for (const entry in playCountArrRef) {
        if (
            mostPlayedGenreName === undefined ||
            mostPlayedGenrePlayCount === undefined
        ) {
            mostPlayedGenreName = entry;
            mostPlayedGenrePlayCount = playCountArrRef[entry];
        }

        const newValue = playCountArrRef[entry];

        if (newValue > mostPlayedGenrePlayCount) {
            mostPlayedGenreName = entry;
            mostPlayedGenrePlayCount = newValue;
        }
    }
    return { mostPlayedGenreName, mostPlayedGenrePlayCount };
}

const data = generateData(1000);
// console.log(data);

const stats = generateStats(data);
// console.log(stats);
