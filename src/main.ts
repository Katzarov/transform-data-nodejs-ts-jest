import { generateData, TrackDataType } from "./generateData";

// type TagStatsType = {
//     name: string;
//     count: number;
// };

interface GenreStatsType {
    genre: string;
    totalPlayCountOfGenre: number;
    // tagsStats: Array<TagStatsType>; // will not be implemented
}

// TODO: this implies we can handle infinitely nested genre objects but we dont.
// should probably just add a subGenres Track to the GenreStatsType and make it optional.
interface GenreAndSubGenresStatsType extends GenreStatsType {
    subGenres?: Array<GenreAndSubGenresStatsType>;
}

export interface StatsType {
    totalPlayCountOfAllTracks: number;
    mostPlayedGenreName: string;
    mostPlayedGenrePlayCount: number;
    moreDetailsByGenre: Array<GenreAndSubGenresStatsType>;
}
// TODO: In general, do we do any runtime validation on the fetched data ? or we assume the contract is satisfied.
export function generateStats(tracks: Array<TrackDataType>): StatsType {
    const statsInitialValue: StatsType = {} as StatsType; // TODO: just init the obj here with first entry
    const playCountPerGenre = new Map<string, number>();

    return tracks.reduce((stats: StatsType, track: TrackDataType): StatsType => {
        // total count
        if (stats.totalPlayCountOfAllTracks === undefined) {
            stats.totalPlayCountOfAllTracks = track.playCount;
        } else {
            stats.totalPlayCountOfAllTracks =
                stats.totalPlayCountOfAllTracks + track.playCount;
        }
        const { mostPlayedGenreName, mostPlayedGenrePlayCount } =
            getMostPlayedGenreAndCount(playCountPerGenre, track);

        //TODO test, can and should I test if the objects passed to a funciton are mutated when they should not be.
        stats.mostPlayedGenreName = mostPlayedGenreName;
        stats.mostPlayedGenrePlayCount = mostPlayedGenrePlayCount;

        // fist iteration
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
                    subGenreEntryRef.totalPlayCountOfGenre =
                        subGenreEntryRef.totalPlayCountOfGenre + track.playCount;
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

type MostPlayedGenreAndCountType = {
    mostPlayedGenreName: string;
    mostPlayedGenrePlayCount: number;
};

/**
 * @modifies {playCountPerGenre}
 */
export function getMostPlayedGenreAndCount(
    playCountPerGenre: Map<string, number>,
    track: TrackDataType
): MostPlayedGenreAndCountType {
    const { genre, playCount } = track;

    if (playCountPerGenre.has(genre)) {
        const currentCount = playCountPerGenre.get(genre);
        playCountPerGenre.set(genre, currentCount! + playCount);
    } else {
        playCountPerGenre.set(genre, playCount);
    }

    return Array.from(playCountPerGenre).reduce(
        (
            stats: MostPlayedGenreAndCountType,
            [genre, playCount]
        ): MostPlayedGenreAndCountType => {
            // first iteration
            if (
                stats.mostPlayedGenreName === undefined ||
                stats.mostPlayedGenrePlayCount === undefined
            ) {
                stats.mostPlayedGenreName = genre;
                stats.mostPlayedGenrePlayCount = playCount;

                return stats;
            }

            if (stats.mostPlayedGenrePlayCount < playCount) {
                stats.mostPlayedGenreName = genre;
                stats.mostPlayedGenrePlayCount = playCount;
            }

            return stats;
        },
        {} as MostPlayedGenreAndCountType
    );
}

const data = generateData(1000);
// console.log(data);

const stats = generateStats(data);
// console.log(stats);
