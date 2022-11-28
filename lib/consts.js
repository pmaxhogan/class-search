import * as dotenv from "dotenv"
dotenv.config();

export const LOCATION_TYPES = {
    NONE: "none",
    SPECIAL: "special",
    ROOM: "room"
};
export const DAYS_TYPES = {
    NONE: "none",
    ONCE: "once",
    RECURRING: "recurring"
};
export const courseLocationHeaders = ["Practicum", "Laboratory - No Lab Fee", "(Hybrid)", "Seminar", "Studio Art", "Laboratory", "Secondary Lecture", "Combined Lec/Lab no Fee", "Combined Lec/Lab w/Fee", "Common Exam", "Practicum (Hybrid)", "Studio Ensemble", "Studio Ensemble (Hybrid)", "Exam"];
export const noLocationHeaders = ["No Meeting Room", "Independent Study", "Internship", "Research", "Master's Thesis", "Dissertation", "Seminar (Hybrid)", "Studio Art (Hybrid)"];

export const newHeaders = ["Practicum", "Laboratory - No Lab Fee", "(Hybrid)", "Seminar", "Studio Art", "Laboratory", "Secondary Lecture", "Combined Lec/Lab no Fee", "Combined Lec/Lab w/Fee", "Common Exam", "Practicum (Hybrid)", "Studio Ensemble", "Studio Ensemble (Hybrid)", "Exam", "No Meeting Room", "Independent Study", "Internship", "Research", "Master's Thesis", "Dissertation", "Seminar (Hybrid)", "Studio Art (Hybrid)", "See instructor for room assignment"];

export const specialLocations = ["See instructor for room assignment", "Blackstone Launchpad"];
export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const gradLevels = {
    undergraduate: "clevel_u",
    graduate: "clevel_g",
};
export const loginStr = "<title>COMET AUTH - University of Texas at Dallas - Web Authentication</title>";
export const sessionId = process.env.SESSION_ID;
export const mismatchIgnore = ["cp_epcs", "cp_fren", "cp_germ", "cp_isah", "cp_mils", "cp_mthe", "cp_ppol", "cp_rels", "cp_smed"]
