// noinspection JSUnusedGlobalSymbols

import functions from "firebase-functions";
import {stat} from "fs/promises";
import {getSectionsFromDisk} from "./lib/coursebook/getSections.js";
import e from "express";

const sections = await getSectionsFromDisk();

const app = e();

app.get("/api", (req, res) => res.send("Loaded " + sections.length + " sections"));

export const api = functions.https.onRequest(app);
