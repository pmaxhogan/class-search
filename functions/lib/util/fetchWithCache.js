import {getFromCache, saveToCache} from "./cache.js";
import fetch from "node-fetch";

export async function fetchWithCache(url, options = {}) {
    const optionsWithoutCookie = JSON.parse(JSON.stringify(options));
    if (optionsWithoutCookie.headers && optionsWithoutCookie.headers.cookie) delete optionsWithoutCookie.headers.cookie;

    const cacheKey = JSON.stringify({url, optionsWithoutCookie});
    const cached = await getFromCache(cacheKey);
    if (cached) {
        console.log("using cached", url);
        return cached;
    }
    console.log("fetching from network", url);
    const res = await fetch(url, options);
    const text = await res.text();
    if (res.status === 200) {
        await saveToCache(cacheKey, text);
        return text;
    } else {
        console.log(res);
        console.log(text);
        throw new Error("Fetch failed " + res.status);
    }
}
