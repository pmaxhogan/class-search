import * as fs from 'node:fs/promises';
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultCacheFolder = path.join(__dirname, "..", "..", "cache");

async function prepareFolder(cacheKey, cacheFolder = defaultCacheFolder){
    const sha256 = crypto.createHash("sha256");
    sha256.update(cacheKey);
    const cacheFileName = sha256.digest("hex");
    const cacheStart = cacheFileName.slice(0, 2);
    const cacheEnd = cacheFileName.slice(2);
    await fs.mkdir(path.join(cacheFolder, cacheStart), {recursive: true});
    return path.join(cacheFolder, cacheStart, cacheEnd);
}

export async function getFromCache(cacheKey, cacheFolder = defaultCacheFolder){
    const dest = await prepareFolder(cacheKey, cacheFolder);
    console.log("searching for", dest);
    try {
        const readText = await fs.readFile(dest, "utf8");
        return JSON.parse(readText);
    }catch(e){
        if(e.code !== "ENOENT"){
            throw e;
        }
        return null;
    }
}
export async function saveToCache(cacheKey, props, cacheFolder = defaultCacheFolder){
    const dest = await prepareFolder(cacheKey, cacheFolder);
    console.log("saving to", dest);
    await fs.writeFile(dest, JSON.stringify(props));
}
