import * as dotenv from "dotenv";
import {mkdir, readFile} from "fs/promises";
import {load} from "cheerio";
import fetch from "node-fetch";
import {writeFileSync} from "fs";
import {fetchSectionsInPrefix} from "./fetchSections/inPrefix.js";
import json2csv from "json-2-csv";

dotenv.config();

const {json2csvAsync} = json2csv;

async function getSections(term) {
    const mainPageReq = await fetch("https://coursebook.utdallas.edu/");
    console.log(mainPageReq.headers.get("set-cookie"));

    const mainPage = await mainPageReq.text();
    const $ = load(mainPage);

    let results = [];
    const prexfixOpts = Array.from($("#combobox_cp option")).map(x => x.attribs.value);
    for (const prefixOpt of prexfixOpts) {
        const newResults = await fetchSectionsInPrefix(prefixOpt, term) || [];
        results = results.concat(newResults);
    }
    return results;
}

export async function writeSections(term) {
    const allSections = await getSections(term);
    await mkdir("export", {recursive: true});
    writeFileSync(`export/allSections.json`, JSON.stringify(allSections));
    writeFileSync("export/allSections.json.txt", allSections.map(section => JSON.stringify(section)).join("\n"));
    writeFileSync("export/allSections.csv", await json2csvAsync(allSections));
}

let sections = null;

async function loadSectionsFromDisk() {
    return JSON.parse((await readFile("export/allSections.json")).toString());
}

export async function getSectionsFromDisk() {
    if (sections) return sections;

    sections = await loadSectionsFromDisk();
    return sections;
}
