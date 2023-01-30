import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Grid, Tooltip} from "@mui/material";
import IconLabeledText from "./IconLabeledText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TimerIcon from "@mui/icons-material/Timer";
import AccordionDetails from "@mui/material/AccordionDetails";
import SchoolIcon from "@mui/icons-material/School";
import PortraitIcon from "@mui/icons-material/Portrait";
import RoomIcon from '@mui/icons-material/Room';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";
import {DateTime} from "luxon";
import {
    endingTimeOfSection,
    getStatusText,
    getWhenItOccurs,
    isoToDurationUntilString,
    timeAllowance
} from "../lib/dateTimeStuff";

export default function BuildingRow({room, nextMeetings, startDate}) {
    const startDateAsDate = new Date(startDate);
    const nextMeetingResult = nextMeetings[0];

    if (!nextMeetingResult) return null;

    const {nextMeeting, courseSection: {course, section}} = nextMeetingResult;

    // console.log(nextMeeting, new Date(nextMeeting), new Date(nextMeeting).getTime(), "a", startDateAsDate.getTime() + timeAllowance);
    const isBusy = new Date(nextMeeting).getTime() < startDateAsDate.getTime() + timeAllowance;

    let freeAt = null;
    if (isBusy) {
        const nextMeetingDate = new Date(nextMeeting);
        for (const nextMeetingResult of nextMeetings) {
            const startsAt = new Date(nextMeetingResult.nextMeeting);
            if (freeAt && startsAt.getTime() > freeAt.getTime() + timeAllowance) {
                console.log("BREAK", !!freeAt, startsAt.getTime() > freeAt.getTime() + timeAllowance);
                break;
            }
            freeAt = endingTimeOfSection(nextMeetingResult);
        }
    }

    const durationUntilStr = isoToDurationUntilString(nextMeeting, startDate);
    const whenItOccurs = getWhenItOccurs(nextMeetingResult);
    const statusText = getStatusText(nextMeetingResult);

    const courseString = course.prefix + " " + course.code + "." + section.number;

    // noinspection JSObjectNullOrUndefined
    const timerLabel = isBusy ? "busy for " + isoToDurationUntilString(freeAt.toISOString(), startDate) : "free for " + durationUntilStr;

    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Grid container spacing={2} direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<RoomIcon/>}
                                     label={room}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<TimerIcon/>} label={timerLabel}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<ScheduleIcon/>}
                                     label={courseString + " @ " + section.time.start + " - " + section.time.end}/>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<SchoolIcon/>} label={course.title}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<PortraitIcon/>} label={section.instructor}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<CalendarMonthIcon/>}
                                     label={whenItOccurs}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<InfoIcon/>}
                                     label={statusText} tooltip="Status"/>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
}