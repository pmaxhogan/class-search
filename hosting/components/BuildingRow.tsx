import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Grid} from "@mui/material";
import IconLabeledText from "./IconLabeledText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TimerIcon from "@mui/icons-material/Timer";
import NumbersIcon from "@mui/icons-material/Numbers";
import AccordionDetails from "@mui/material/AccordionDetails";
import SchoolIcon from "@mui/icons-material/School";
import PortraitIcon from "@mui/icons-material/Portrait";
import RoomIcon from '@mui/icons-material/Room';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";
import {DateTime} from "luxon";
import {getStatusText, getWhenItOccurs, isoToDurationUntilString} from "../lib/dateTimeStuff";

export default function BuildingRow({room, nextMeetings}) {
    const nextMeeting = nextMeetings[0];

    if(!nextMeeting) return null;

    const {course, section} = nextMeeting.courseSection;

    const durationUntilStr = isoToDurationUntilString(nextMeeting.nextMeeting);
    const whenItOccurs = getWhenItOccurs(nextMeeting);
    const statusText = getStatusText(nextMeeting);

    const courseString = course.prefix + " " + course.code + "." + section.number;
    console.log(DateTime.fromISO(nextMeeting.nextMeeting, {zone: "local"}).toRelative());

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
                    <IconLabeledText icon={<TimerIcon/>} label={"free for " + durationUntilStr}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<ScheduleIcon/>} label={courseString + " @ " + section.time.start + " - " + section.time.end}/>
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
                                     label={statusText}/>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
}