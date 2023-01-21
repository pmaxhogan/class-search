import React from "react";
import {DateTime} from "luxon";
import TimerIcon from '@mui/icons-material/Timer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PortraitIcon from '@mui/icons-material/Portrait';
import NumbersIcon from '@mui/icons-material/Numbers';
import {Grid} from "@mui/material";
import IconLabeledText from "./IconLabeledText";


const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

export default function ResultRow({results}) {
    console.log(results);
    const result = results[0];
    const dateTimeObj = DateTime.fromISO(result.nextMeeting, {zone: "local"});
    // noinspection TypeScriptValidateJSTypes
    const str = dateTimeObj.toRelativeCalendar() + " at " + dateTimeObj.toLocaleString({
        hour: "2-digit",
        minute: "2-digit"
    });
    const durationUntil = dateTimeObj.diffNow().shiftTo("hours", "minutes").toObject();
    const durationUntilStr = `${pluralize(durationUntil.hours, "hour")} and ${pluralize(Math.floor(durationUntil.minutes), "minute")}`;

    /**
     * TODO:
     * - separate by each day
     * - gap row (with styling)
     * - expand text
     * - handle currently in session
     * */

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
                                     label={course.prefix + " " + course.code + "." + section.number}/>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
                <Grid container spacing={2}>
                    <Grid item sm={6} md={4}>
                        <IconLabeledText icon={<SchoolIcon/>} label={result.courseSection.course.title}/>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <IconLabeledText icon={<NumbersIcon/>}
                                         label={results.map(result => result.courseSection.course.prefix + " " + result.courseSection.course.code + "." + result.courseSection.section.number).join(", ")}/>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <IconLabeledText icon={<PortraitIcon/>} label={result.courseSection.section.instructor}/>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <IconLabeledText icon={<CalendarMonthIcon/>}
                                         label={result.courseSection.section.days.when.join(", ") || "Unknown"}/>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <IconLabeledText icon={<ScheduleIcon/>} label={section.time.start + " - " + section.time.end}/>
                    </Grid>
                </Grid>
            </Typography>
        </AccordionDetails>
    </Accordion>
}
