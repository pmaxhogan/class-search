import {load} from "cheerio";
import fetch from "node-fetch";
import {writeFileSync} from "fs";
import {fetchSectionsInPrefix} from "./fetchSections/inPrefix.js";
import {fetchSectionsInPrefixViaExport} from "./fetchSections/inPrefixViaExport.js";

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
// console.log([...new Set((allSections).map(x => x).filter(Boolean).map(x => JSON.stringify(x)))].sort().join("\n"));
writeFileSync("allSections.json.txt", allSections.map(section => JSON.stringify(section)).join("\n"));
