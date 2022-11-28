import * as dotenv from "dotenv";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {nextMeetingsInLocation, roomInBuildingsByNextMeeting} from "../findRooms/nextMeetingInLocation.js";
import {getBuildings} from "../findRooms/getBuildings.js";
import {getRoomsInBuilding} from "../findRooms/getRooms.js";
import {writeSections} from "../coursebook/getSections.js";

dotenv.config();

yargs(hideBin(process.argv))
    .command("study", "find next class in a room", (yargs) => {
        yargs.command("building <building>", "search for rooms to study in the given building", () => {
        }, async ({building}) => {
            const inBuilding = await roomInBuildingsByNextMeeting(building);

            if (!inBuilding.length) return console.log("No rooms found in building " + building);

            console.log((inBuilding).map(x => `Room: ${x.room.building} ${x.room.floor}.${x.room.room}\tNext Class:  ${x.nextMeeting.nextMeeting?.toLocaleString()}`).join("\n"));
        });
        yargs.command("room <building> <floor> <room>", "search for next classes in the given room", (yargs) => {
            yargs.positional("building", {type: "string", describe: "building code"});
            yargs.positional("floor", {type: "number", describe: "floor number"});
            yargs.positional("room", {type: "string", describe: "room number"});
            yargs.option("all", {type: "boolean", describe: "show all classes in the room"});
        }, async ({building, room, floor, all}) => {
            const roomStr = `${building} ${floor}.${room}`;

            let meetings = await nextMeetingsInLocation({building, room: room, floor: floor});
            if (!meetings) return console.log("No classes found in room " + roomStr);
            if (!all) meetings = meetings.slice(0, 1);

            meetings.forEach(meeting => {
                const location = meeting.courseSection.section.location;
                console.log(`Room: ${location.building} ${location.floor}.${location.room}\tNext Class:  ${meeting.courseSection.course.prefix} ${meeting.courseSection.course.code}: ${meeting.courseSection.course.title}\t@${meeting.nextMeeting?.toLocaleString()}`);
            });
        });
        yargs.demandCommand(1);
    }, async () => {
    })
    .command("info", "information about a room / building", (yargs) => {
        yargs.command("buildings", "list all buildings", () => {
        }, async () => {
            const buildings = await getBuildings();
            console.log("Found " + buildings.length + " buildings");
            console.log(buildings.sort().join("\n"));
        });
        yargs.command("rooms <building>", "list all rooms in the given building", () => {
        }, async ({building}) => {
            const rooms = await getRoomsInBuilding(building);
            console.log("Found " + rooms.length + " rooms in building " + building);
            console.log(rooms.map(x => `${x.building} ${x.floor}.${x.room}`).sort().join("\n"));
        });
        yargs.demandCommand(1);
    }, async () => {
    })
    .command("writesections", "write all sections to disk", () => {
    }, async () => {
        await writeSections(process.env.COURSE_TERM);
    })
    .demandCommand(1)
    .parse();
