// what i need to do: weird cartesian product of location, date, and time for duplicate sections that meet in different locations and/or different times and or different dates.
//     use Set()

import fetch from "node-fetch";
import {load} from "cheerio";
import {getFromCache, saveToCache} from "./cache.js";
import {LOCATION_TYPES} from "./consts.js"

const dedupe = arr => [...new Set(arr)];

const fetchWithCache = async (url, options = {}) => {
    const optionsWithoutCookie = JSON.parse(JSON.stringify(options));
    if (optionsWithoutCookie.headers && optionsWithoutCookie.headers.cookie) delete optionsWithoutCookie.headers.cookie;

    const cacheKey = JSON.stringify({url, optionsWithoutCookie});
    const cached = await getFromCache(cacheKey);
    if (cached) {
        console.log("using cached", url);
        return cached;
    }
    console.log("fetching", url);
    const res = await fetch(url, options);
    const text = await res.text();
    if (res.status === 200) {
        await saveToCache(cacheKey, text);
        return text;
    } else {
        console.log(text);
        throw new Error("fetch failed");
    }
};

const courseLocationHeaders = ["Practicum", "Laboratory - No Lab Fee", "(Hybrid)", "Seminar", "Studio Art", "Laboratory", "Secondary Lecture", "Combined Lec/Lab no Fee", "Combined Lec/Lab w/Fee", "Common Exam", "Practicum (Hybrid)", "Studio Ensemble", "Studio Ensemble (Hybrid)"];
const noLocationHeaders = ["No Meeting Room", "Independent Study", "Internship", "Research", "Master's Thesis", "Dissertation"];


// TODO: grab cookie from here
const mainPage = await fetchWithCache("https://coursebook.utdallas.edu/");
const $ = load(mainPage);

const results = [];
const prexfixOpts = Array.from($("#combobox_cp option")).map(x => x.attribs.value);
for (const prefixOpt of prexfixOpts) {
    if (!prefixOpt) continue;
    if (prefixOpt === "cp_econ") break;// TEMP

    const ourOpts = ["term_23s", prefixOpt, "site_utdm"];
    const searchBody = "action=search&" + ourOpts.map(x => `s%5B%5D=${x}`).join("&");
    console.log("Searching for prefix", prefixOpt);

    const text = await fetchWithCache("https://coursebook.utdallas.edu/clips/clip-cb11-hat.zog", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_gcl_au=1.1.2126683591.1665010802; _fbp=fb.1.1665010802352.1665554111; nmstat=eeee6a59-98ed-2f15-a3bf-c5cc5b7f6cc7; _tt_enable_cookie=1; _ttp=9e17c329-7ad7-495f-9a96-da67847700b1; _ga=GA1.2.618835793.1665010802; _ga_S5RECKWMRS=GS1.1.1665198401.2.1.1665198428.33.0.0; apt.uid=AP-PQQY5YJEHTTA-2-1667086945310-38691647.0.2.98d14775-b7b4-4490-92e9-d40056345bd2;  PTGSESSID=5rtd5n27vk1koa7m805ho6l7pv",
            "Referer": "https://coursebook.utdallas.edu/",
            "Referrer-Policy": "no-referrer-when-downgrade"
        },
        "body": searchBody,
        "method": "POST"
        /*"body": searchBody,
        "method": "POST",
        "headers": {
            "accept": "*" + "/" + "*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_gcl_au=1.1.2126683591.1665010802; _fbp=fb.1.1665010802352.1665554111; nmstat=eeee6a59-98ed-2f15-a3bf-c5cc5b7f6cc7; _tt_enable_cookie=1; _ttp=9e17c329-7ad7-495f-9a96-da67847700b1; _ga=GA1.2.618835793.1665010802; _ga_S5RECKWMRS=GS1.1.1665198401.2.1.1665198428.33.0.0; apt.uid=AP-PQQY5YJEHTTA-2-1667086945310-38691647.0.2.98d14775-b7b4-4490-92e9-d40056345bd2; PTGSESSID=5rtd5n27vk1koa7m805ho6l7pv",
            "Referer": "https://coursebook.utdallas.edu/",
            "Referrer-Policy": "no-referrer-when-downgrade"
        }*/
    });

    const parsedResponse = JSON.parse(text);
    if (parsedResponse.sethtml["#searchresults"].includes("(no items found)")) {
        console.log("0 results for prefix", prefixOpt);
        continue;
    }

    const expectedNumResults = parseInt(/\(([0-9]+) items\)/.exec(parsedResponse.sethtml["#searchresults"])[1]);
    console.log("Expecting " + expectedNumResults + " results");

    if (expectedNumResults >= 300) {
        throw new Error("too many results");
    }

    const $results = load(parsedResponse.sethtml["#sr"]);
    const rows = $results("tbody tr");
    if (rows.length !== expectedNumResults) {
        throw new Error("expected " + expectedNumResults + " results, got " + rows.length);
    }
    rows.each((i, el) => {
        const $el = $results(el);
        const $tds = Array.from($el.find("td"));

        const termAndStatus = $results($tds[0]).text().trim();
        const coursePrefixCodeAndSection = $results($tds[1]).text().trim().split(" ");
        const courseTitle = $results($tds[3]).text().trim().replace(/ \([0-9-]+ (Semester Credit Hours|Credits)\)/, "");
        const courseInstructor = $results($tds[4]).text().trim().replaceAll(",\n", ",").replaceAll("\n", "");
        const scheduleAndLocationParts = $tds[5].children.map(x => $results(x).text().trim()).join("\n")
            .split("\n").filter(Boolean).map(x => x.trim());

        const isOpen = termAndStatus.endsWith("Open");
        const isStopped = termAndStatus.endsWith("Stopped");
        if(!isOpen && !isStopped && !termAndStatus.endsWith("Full")){
            console.log(courseTitle, courseInstructor, coursePrefixCodeAndSection, scheduleAndLocationParts);
            throw new Error("Unexpected termAndStatus " + termAndStatus);
        }
        const term = termAndStatus.slice(0, 3);


        const coursePrefix = coursePrefixCodeAndSection[0];
        const courseCode = coursePrefixCodeAndSection[1].split(".")[0];
        const courseSection = coursePrefixCodeAndSection[1].split(".")[1];

        let daysList, times, locations;

        if (courseLocationHeaders.includes(scheduleAndLocationParts[0])) {
            scheduleAndLocationParts.shift();
        }
        if (noLocationHeaders.includes(scheduleAndLocationParts[0]) || !scheduleAndLocationParts.length) {
            daysList = times = locations = [null];
        } else if (scheduleAndLocationParts.length % 3 === 0 || scheduleAndLocationParts.length === 2) {
            const foundDays = dedupe(scheduleAndLocationParts.filter((x, i) => i % 3 === 0));
            const foundTimes = dedupe(scheduleAndLocationParts.filter((x, i) => i % 3 === 1));
            const foundLocations = dedupe(scheduleAndLocationParts.filter((x, i) => i % 3 === 2)).map(location => location === "No Meeting Room" ? null : location);
            daysList = foundDays;
            times = foundTimes;
            locations = foundLocations;
        } else {
            console.log(scheduleAndLocationParts);
            throw new Error("unexpected schedule and locations parts");
        }

        for (const location of locations) {
            for (const days of daysList) {
                for (const time of times) {
                    let locationObject;
                    if(location === null){
                        locationObject = {type: LOCATION_TYPES.NONE};
                    }else if(location === "See instructor for room assignment"){
                        locationObject = {type: LOCATION_TYPES.SPECIAL, room: location};
                    }else{
                        const split = location.split(" ");
                        if(split.length !== 2){
                            throw new Error("Unknown location " + location);
                        }
                        const building = split[0];
                        const split2 = split[1].split(".");
                        if(split.length !== 2){
                            throw new Error("Unknown location " + location);
                        }
                        const floor = parseInt(split2[0]);
                        if(isNaN(floor)){
                            throw new Error("Unknown floor " + floor + " on location " + location);
                        }
                        const room = split2[1];
                        locationObject = {type: LOCATION_TYPES.ROOM, building, room, floor};
                    }

                    const resultObj = {
                        course: {
                            prefix: coursePrefix,
                            code: courseCode,
                            title: courseTitle
                        },
                        section: {
                            number: courseSection,
                            instructor: courseInstructor,
                            days,
                            time,
                            location: locationObject,
                            term,
                            isOpen,
                            isStopped
                        }
                    };

                    if(location === "See instructor for room assignment") console.log(resultObj);

                    results.push(resultObj);
                }
            }
        }
    });
}
console.log([... new Set(results.map(x=>x.section.location).filter(Boolean).map(x=>JSON.stringify(x)))].sort().join("\n"));
