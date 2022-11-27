import {sessionId} from "../consts.js";

export function getCookies() {
    return `PTGSESSID=${sessionId}`;
}
