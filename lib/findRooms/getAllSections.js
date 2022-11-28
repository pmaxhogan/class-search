import {readFile} from "fs/promises";

let sections = null;

async function fetchAllSections() {
    return JSON.parse((await readFile("export/allSections.json")).toString());
}

export default async function getAllSections() {
    if (sections) return sections;

    sections = await fetchAllSections();
    return sections;
}
