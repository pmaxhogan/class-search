// noinspection JSUnusedGlobalSymbols

import functions from "firebase-functions";
import {stat} from "fs/promises";
import {getSectionsFromDisk} from "./lib/coursebook/getSections.js";
import e from "express";
import {nextMeetingsInLocation} from "./lib/findRooms/nextMeetingInLocation.js";
import {getBuildings} from "./lib/findRooms/getBuildings.js";
import {getRoomsInBuilding} from "./lib/findRooms/getRooms.js";
import {coursebookTimeZone} from "./lib/consts.js";
import {cloneDate} from "./lib/findRooms/nextMeetings.js";

const sections = await getSectionsFromDisk();
const buildings = await getBuildings();
const rooms = await Promise.all(buildings.map(async building => {
    const roomsInBuilding = await getRoomsInBuilding(building);
    return {building, rooms: roomsInBuilding};
}));

const app = e();

app.get("/api", (req, res) => res.send("Loaded " + sections.length + " sections"));

app.get("/api/rooms", async (req, res) => {
    res.json(rooms);
});

app.get("/api/study/room", async (req, res) => {
    const roomStr = req.query.room;
    const startDateTime = req.query.start ? new Date(req.query.start) : new Date();
    if(!roomStr) return res.status(400).send("Missing room");
    if(!startDateTime) return res.status(400).send("Missing referenceDateTime");
    const split = roomStr.split(" ");
    if (split.length !== 2) return res.status(400).send("Invalid roomStr");
    const [building, room] = split;
    const split2 = room.split(".");
    if (split2.length !== 2) return res.status(400).send("Invalid roomStr");
    let [floor, roomNum] = split2;
    const roomStr2 = `${building} ${floor}.${roomNum}`;
    if(roomStr !== roomStr2){
        return res.status(400).send("Invalid roomStr");
    }
    floor = parseInt(floor);
    if(isNaN(floor)) return res.status(400).send("Invalid roomStr");

    const endToleranceMs = 1000 * 60 * 15;

    const meetings = await nextMeetingsInLocation({building, room: roomNum, floor: floor}, startDateTime, endToleranceMs);
    if (!meetings) return res.status(404).send("No classes found in room " + roomStr);
    res.json(meetings);
});

export const api = functions.https.onRequest(app);
