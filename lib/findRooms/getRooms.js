import getAllSections from "./getAllSections.js";
import {LOCATION_TYPES} from "../consts.js";
import {getBuildings} from "./getBuildings.js";

export async function getRooms() {
    const sections = await getAllSections();

    const rooms = new Set();

    for (const courseSection of sections) {
        if(courseSection.section.location.type === LOCATION_TYPES.ROOM) {
            rooms.add(JSON.stringify(courseSection.section.location));
        }
    }

    return Array.from(rooms).map(room => JSON.parse(room)).sort((a, b) => a.building.localeCompare(b.building) || a.floor - b.floor || a.room.localeCompare(b.room));
}

export async function getRoomsInBuilding(building) {
    if(!(await getBuildings()).includes(building)) throw new Error(`Building ${building} does not exist`);

    const rooms = await getRooms();
    return rooms.filter(room => room.building === building);
}
