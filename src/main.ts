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
        stats.totalPlayCountOfAllTracks = getTotalPlayCountOfAllTracks(
            stats,
            track
        );

        const { mostPlayedGenreName, mostPlayedGenrePlayCount } =
            getMostPlayedGenreAndCount(playCountPerGenre, track);

        //TODO test, can and should I test if the objects passed to a funciton are mutated when they should not be.
        stats.mostPlayedGenreName = mostPlayedGenreName;
        stats.mostPlayedGenrePlayCount = mostPlayedGenrePlayCount;


        // TODO Refactor all below to use the setGenre helper function
        
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
// TODO: in general, breaking it like that we can test smaller chunks of the code.

// much better to do it in separate funcitons, hepls avoid nesting and we can return early.
function getTotalPlayCountOfAllTracks(
    stats: StatsType,
    track: TrackDataType
): number {
    // init case
    if (stats.totalPlayCountOfAllTracks === undefined) {
        return track.playCount;
    }

    return stats.totalPlayCountOfAllTracks + track.playCount;
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

    const mostPlayedInitialValue = {} as MostPlayedGenreAndCountType;
    // TODO: How do we define the init value..., if I keep it as an empty object or array..
    // I neeed to do type asseriton as I couldnt figoure out if it can be done any better.
    // We can also initialize it with the props we expect it to have, so it will correctly typed on teh first iteration.
    // But then need to do some initialization before the reduce. Not sure which is better.
    return Array.from(playCountPerGenre).reduce(
        (
            mostPlayed: MostPlayedGenreAndCountType,
            [genre, playCount]
        ): MostPlayedGenreAndCountType => {
            // init case
            if (
                // I dont like this. How we are doing the check.
                mostPlayed.mostPlayedGenreName === undefined &&
                mostPlayed.mostPlayedGenrePlayCount === undefined
            ) {
                mostPlayed.mostPlayedGenreName = genre;
                mostPlayed.mostPlayedGenrePlayCount = playCount;

                return mostPlayed;
            }

            if (mostPlayed.mostPlayedGenrePlayCount < playCount) {
                mostPlayed.mostPlayedGenreName = genre;
                mostPlayed.mostPlayedGenrePlayCount = playCount;
            }

            return mostPlayed;
        },
        mostPlayedInitialValue
    );
}

/**
 * @modifies {stats}
 */
// TODO: finish impl
function setGenre(
    stats: StatsType,
    track: TrackDataType,
    genreArrayRef?: Array<GenreAndSubGenresStatsType>
): void {
    const { genre, subGenre, playCount } = track;

    // @ts-ignore
    const arr = genreArrayRef ? genreArrayRef : stats.moreDetailsByGenre;

    // check if we already have the same genre name
    const genreEntryRef = arr.find((entry) => entry.genre === track.genre);

    let newGenreEntry: GenreAndSubGenresStatsType;
    // if we do, just update total count of genre
    if (genreEntryRef) {
        genreEntryRef.totalPlayCountOfGenre =
            genreEntryRef.totalPlayCountOfGenre + track.playCount;
    } else {
        // when not there we need to create a new entry and push it to the arr.
        newGenreEntry = {
            genre: genre,
            totalPlayCountOfGenre: playCount,
        };
        arr.push(newGenreEntry);
    }

    if (subGenre) {
  
        // if (newGenreEntry!.subGenres?.length !== 0) {
        //     return;
        // }
        newGenreEntry!.subGenres = [];
        setGenre(stats, track, newGenreEntry!.subGenres);
    }
}

const data = generateData(1000);
// console.log(data);

const stats = generateStats(data);
// console.log(stats);
