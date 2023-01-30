import React from "react";
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
import {getStatusText, getWhenItOccurs, isoToDurationUntilString} from "../lib/dateTimeStuff";


export default function ResultRow({results, startDate}) {
    const result = results[0];
    const durationUntilStr = isoToDurationUntilString(result.nextMeeting, startDate);
    const timerLabel = durationUntilStr === "0m" ? "in progress" : durationUntilStr + " from " + (startDate ? " then" : " now");

    const statusText = getStatusText(result);

    const whenItOccurs = getWhenItOccurs(result);

    const courseCodesFull = results.map(result => result.courseSection.course.prefix + " " + result.courseSection.course.code + "." + result.courseSection.section.number).join(", ");
    let courseCodes;
    if (courseCodesFull.includes("BMEN")) console.log("result.length > 2", result);
    if (result.length > 2) {
        courseCodes = result.courseSection.course.prefix + " " + result.courseSection.course.code + "." + result.courseSection.section.number + ", ...";
    } else {
        courseCodes = courseCodesFull;
    }

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
                    <IconLabeledText icon={<ScheduleIcon/>} label={section.time.start + " - " + section.time.end}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<TimerIcon/>} label={timerLabel}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<NumbersIcon/>}
                                     label={courseCodes}/>
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
                                     label={statusText} tooltip="Status"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <IconLabeledText icon={<NumbersIcon/>}
                                     label={courseCodesFull}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<TimerIcon/>} label={timerLabel}/>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
}
