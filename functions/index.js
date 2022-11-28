import functions from "firebase-functions";
import {stat} from "fs/promises";
import {getSectionsFromDisk} from "./lib/coursebook/getSections.js";

const sections = await getSectionsFromDisk();

export const helloWorld = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs! " + await stat("export/allSections.json"), {structuredData: true});
  functions.logger.info("Loaded " + sections.length, {structuredData: true});
  response.send("" + sections.length);
});
