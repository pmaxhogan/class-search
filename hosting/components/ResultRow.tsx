import React from "react";
import {DateTime} from "luxon";
import TimerIcon from '@mui/icons-material/Timer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PortraitIcon from '@mui/icons-material/Portrait';
import NumbersIcon from '@mui/icons-material/Numbers';
import InfoIcon from '@mui/icons-material/Info';
import {Grid} from "@mui/material";
import IconLabeledText from "./IconLabeledText";


const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

export default function ResultRow({results}) {
    const result = results[0];
    const dateTimeObj = DateTime.fromISO(result.nextMeeting, {zone: "local"});
    const durationUntil = dateTimeObj.diffNow().shiftTo("hours", "minutes").toObject();
    const durationUntilStr = `${pluralize(durationUntil.hours, "hour")} and ${pluralize(Math.floor(durationUntil.minutes), "minute")}`;

    const statusText = "Status: " + (result.courseSection.section.isStopped ? "Stopped" : (result.courseSection.section.isCancelled ? "Cancelled" : (result.courseSection.section.isOpen ? "Open" : "Closed")));


    const days = result.courseSection.section.days;
    const whenItOccurs = days.type === "once" ? days.when : (days.type === "recurring" ? days.when.join(", ") : "Unknown");

    const {section, course} = result.courseSection;
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
                    <IconLabeledText icon={<TimerIcon/>} label={durationUntilStr + " from now"}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<ScheduleIcon/>} label={section.time.start + " - " + section.time.end}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<NumbersIcon/>}
                                     label={results.map(result => course.prefix + " " + course.code + "." + result.courseSection.section.number).join(", ")}/>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<SchoolIcon/>} label={course.title}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<PortraitIcon/>} label={result.courseSection.section.instructor}/>
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
