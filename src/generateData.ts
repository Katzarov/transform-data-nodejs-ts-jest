// TODO: just experimenting with how to type stuff this
// would probably not use in prod
export { };
declare global {
    interface Array<T> {
        getRandomEntry(): T;
    }
}

Array.prototype.getRandomEntry = function () {
    const randomIndex = Math.floor(Math.random() * this.length);

    return this[randomIndex];
};

const genres = [
    {
        name: "Blues",
        subgenres: [
            { name: "12-bar" },
            { name: "Texas shuffle" },
            { name: "Soul" },
        ],
        tags: ["slow", "burning", "shuffle", "guitar solos", "very fast"],
    },
    {
        name: "Jazz",
        subgenres: [
            { name: "Free Jazz" },
            { name: "Bepop" },
            { name: "Jazz - Rock Fusion" },
        ],
        tags: [
            "drum solos",
            "sax solos",
            "solos",
            "very fast",
            "odd time signatures",
        ],
    },
    {
        name: "Rock",
        subgenres: [
            { name: "Classic" },
            { name: "Rock - Jazz Fusion" },
            { name: "Progressive" },
        ],
        tags: ["hard", "guitar solos", "vocal screams", "epic"],
    },
];

export interface TrackDataType {
    name: string;
    genre: string;
    subGenre: string;
    playCount: number;
    tags: Array<string>;
}

function generateEntry(): TrackDataType {
    const randomGenre = genres.getRandomEntry();
    const randomSubGenre = randomGenre.subgenres.getRandomEntry();

    const tagsSet: Set<string> = new Set();
    tagsSet.add(randomGenre.tags.getRandomEntry());
    tagsSet.add(randomGenre.tags.getRandomEntry());
    tagsSet.add(randomGenre.tags.getRandomEntry());

    const uniqueTags = [...tagsSet];

    const randomPlayCount = Math.floor(Math.random() * 10000);

    return {
        name: "Random Name",
        genre: randomGenre.name,
        subGenre: randomSubGenre.name,
        playCount: randomPlayCount,
        tags: uniqueTags,
    };
}

/**
 * @throws {Error}
 */
// TODO: this could throw, how do you type this ?
export function generateData(numEntries: number): Array<TrackDataType> {
    if (numEntries < 0) {
        throw new Error("Number of entires must be a non-negative number");
    }
    let data = [];

    for (let i = 0; i < numEntries; i++) {
        const entry = generateEntry();
        data.push(entry);
    }

    return data;
}

// TODO: how to properply type this promise, as it could also reject with an Error type.
// doing a union of Error with TrackDataType didnt seem to be type safe when I tried to use it.
export async function generateDataAsync(
    numEntries: number
): Promise<Array<TrackDataType>> {
    return new Promise((resolve, reject) => {
        try {
            const data = generateData(numEntries);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}
