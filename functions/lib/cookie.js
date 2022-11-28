import {getFromCache, saveToCache} from "./util/cache.js";

export async function saveCookie(cookie) {
    await saveToCache("utd-cookie", cookie);
}

export async function loadCookie() {
    return (await getFromCache("utd-cookie"));
}
