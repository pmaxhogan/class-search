import {getFromCache} from "./cache.js";

export async function saveCookie(cookie){
    await getFromCache("utd-cookie", cookie);
}
export async function loadCookie(){
    return (await getFromCache("utd-cookie")).trim();
}
