import getAllSections from "./getAllSections.js";
import {LOCATION_TYPES} from "../consts.js";

export async function getBuildings() {
    const sections = await getAllSections();

    const buildings = new Set();

    for (const courseSection of sections) {
        if(courseSection.section.location.type === LOCATION_TYPES.ROOM) {
            buildings.add(courseSection.section.location.building);
        }
    }

    return Array.from(buildings);
}
