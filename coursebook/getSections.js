import {load} from "cheerio";
import fetch from "node-fetch";
import {writeFileSync} from "fs";
import {fetchSectionsInPrefix} from "./fetchSections/inPrefix.js";
import {fetchSectionsInPrefixViaExport} from "./fetchSections/inPrefixViaExport.js";
import json2csv from 'json-2-csv';
const { json2csvAsync } = json2csv;
import {mkdir} from "fs/promises";

// TODO
const term = "term_22f";

async function getSections() {
    const mainPageReq = await fetch("https://coursebook.utdallas.edu/");
    console.log(mainPageReq.headers.get('set-cookie'));

    const mainPage = await mainPageReq.text();
    const $ = load(mainPage);

    let results = [];
    const prexfixOpts = Array.from($("#combobox_cp option")).map(x => x.attribs.value);
    for (const prefixOpt of prexfixOpts) {
        const newResults = await fetchSectionsInPrefixViaExport(prefixOpt, term) || [];
        console.log("Got " + newResults.length + " results for prefix " + prefixOpt);
        results = results.concat(newResults);
    }
    return results;
}

const allSections = await getSections();
await mkdir("export", {recursive: true});
writeFileSync("export/allSections.json.txt", allSections.map(section => JSON.stringify(section)).join("\n"));
writeFileSync("export/allSections.csv", await json2csvAsync(allSections));
