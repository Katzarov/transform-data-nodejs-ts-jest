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
        tags: ["slow", "burning", "shuffle", "solos", "very fast", "epic"],
    },
    {
        name: "Jazz",
        subgenres: [
            { name: "Free Jazz" },
            { name: "Bepop" },
            { name: "Rock Fusion" },
        ],
        tags: ["slow", "burning", "shuffle", "solos", "very fast", "epic"],
    },
    {
        name: "Rock",
        subgenres: [
            { name: "Classic" },
            { name: "Jazz Fusion" },
            { name: "Progressive" },
        ],
        tags: ["slow", "burning", "shuffle", "solos", "very fast", "epic"],
    },
];

function generateEntry() {
    const randomGenre = genres.getRandomEntry();
    const randomSub = randomGenre.subgenres.getRandomEntry();

    const tagsSet: Set<string> = new Set();
    tagsSet.add(randomGenre.tags.getRandomEntry());
    tagsSet.add(randomGenre.tags.getRandomEntry());
    tagsSet.add(randomGenre.tags.getRandomEntry());

    const uniqueTags = [...tagsSet];

    return {
        name: "Random Name",
        genre: randomGenre.name,
        subGenre: randomSub.name,
        playCount: Math.floor(Math.random() * 10000),
        tags: uniqueTags,
    };
}

export interface TrackDataType {
    name: string;
    genre: string;
    subGenre: string;
    playCount: number;
    tags: Array<string>;
}

export function generateData(numEntries: number): Array<TrackDataType> {
    let data = [];

    for (let i = 0; i < numEntries; i++) {
        const entry = generateEntry();
        data.push(entry);
    }

    return data;
}
