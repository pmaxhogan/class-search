import {fetchWithCache} from "../fetchWithCache.js";

export async function fetchPrefix(prefix, term, gradLevel = null) {
    const ourOpts = [term, prefix, "site_utdm"];
    if (gradLevel) ourOpts.push(gradLevel);
    const searchBody = "action=search&" + ourOpts.map(x => `s%5B%5D=${x}`).join("&");
    console.log("Searching for prefix", prefix, "with options", ourOpts);

    const text = await fetchWithCache("https://coursebook.utdallas.edu/clips/clip-cb11-hat.zog", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "PTGSESSID=p4d6c2k0nas63sqp3skp7k19kh",
            "Referer": "https://coursebook.utdallas.edu/"
        },
        "body": searchBody,
        "method": "POST"
    });

    return JSON.parse(text);
}
