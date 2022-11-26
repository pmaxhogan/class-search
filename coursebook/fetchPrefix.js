import {fetchWithCache} from "../fetchWithCache.js";

export async function fetchPrefix(prefix, term) {
    const ourOpts = [term, prefix, "site_utdm"];
    const searchBody = "action=search&" + ourOpts.map(x => `s%5B%5D=${x}`).join("&");
    console.log("Searching for prefix", prefix);

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
    });

    return JSON.parse(text);
}
