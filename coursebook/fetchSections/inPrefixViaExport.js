import {load} from "cheerio";
import fetch from "node-fetch";
import {tdsToSectionObjects} from "../parse/tdsToSectionObjects.js";
import {fetchPrefix} from "../fetchPrefix.js";
import {gradLevels, loginStr, mismatchIgnore} from "../../consts.js";
import {writeFileSync} from "fs";
import {fetchWithCache} from "../../util/fetchWithCache.js";
import {exportListToResults} from "../parse/exportListToResults.js";
import {getCookies} from "../getCookies.js";
import {fetchSectionsInPrefix} from "./inPrefix.js";

// TODO
const term = "term_22f";

export async function fetchSectionsInPrefixViaExport(prefixOpt, term, gradLevel = null, forceLogin = false) {
    if (!prefixOpt) return;

    const parsedResponse = await fetchPrefix(prefixOpt, term, gradLevel, forceLogin);
    if (parsedResponse.sethtml["#searchresults"].includes("(no items found)")) {
        console.log("0 results for prefix", prefixOpt);
        return;
    }

    if(parsedResponse.sethtml["#searchresults"].includes("please refine search")) {
        console.log("refine search for prefix", prefixOpt);
        const undergradResults = await fetchSectionsInPrefixViaExport(prefixOpt, term, gradLevels.undergraduate, forceLogin);
        const gradResults = await fetchSectionsInPrefixViaExport(prefixOpt, term, gradLevels.graduate, forceLogin);
        return undergradResults.concat(gradResults);
    }

    const expectedNumResults = parseInt(/\(([0-9]+) items?\)/.exec(parsedResponse.sethtml["#searchresults"])[1]);
    console.log("Expecting " + expectedNumResults + " results");

    if (expectedNumResults >= 300) {
        throw new Error("too many results");
    }



    const $header = load(parsedResponse.sethtml["#searchresults"]);
    const downloadLink = $header(".button-link").attr("href");
    if(!downloadLink){
        return fetchSectionsInPrefix(prefixOpt, term, gradLevel, false);
    }

    if(downloadLink === "https://coursebook.utdallas.edu/login/coursebook") {
        if(forceLogin) {
            throw new Error("Failed to login ", downloadLink);
        }else{
            return fetchSectionsInPrefixViaExport(prefixOpt, term, gradLevel, true);
        }
    }
    const hash = downloadLink.split("/")[3];
    if(hash.length !== 40) {
        throw new Error("Invalid hash " + downloadLink);
    }
    const url = `https://ptg.utdallas.edu/reportmonkey/cb11-export/${hash}/${hash}/json`;
    const text = await fetchWithCache(url, {
        headers: {
            "Cookie": getCookies()
        }
    });
    if(text.includes(loginStr)){
        if(forceLogin) {
            throw new Error("Failed to login, auth token expired");
        }else{
            return fetchSectionsInPrefixViaExport(prefixOpt, term, gradLevel, true);
        }
    }
    const parsed = JSON.parse(text);

    if(parsed["report_data"].length !== expectedNumResults && !(expectedNumResults === 2 && parsed["report_data"].length === 0 && mismatchIgnore.includes(prefixOpt))) {
        throw new Error("Expected " + expectedNumResults + " results, got " + parsed["report_data"].length);
    }

    console.log("download link", downloadLink);
    return exportListToResults(parsed["report_data"]);
}
