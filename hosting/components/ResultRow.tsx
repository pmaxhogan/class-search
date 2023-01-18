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
import {Grid} from "@mui/material";
import IconLabeledText from "./IconLabeledText";


const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

export default function ResultRow({result}) {
    const dateTimeObj = DateTime.fromISO(result.nextMeeting, {zone: "local"});
    // noinspection TypeScriptValidateJSTypes
    const str = dateTimeObj.toRelativeCalendar() + " at " + dateTimeObj.toLocaleString({
        hour: "2-digit",
        minute: "2-digit"
    });
    const durationUntil = dateTimeObj.diffNow().shiftTo("hours", "minutes").toObject();
    const durationUntilStr = `${pluralize(durationUntil.hours, "hour")} and ${pluralize(Math.floor(durationUntil.minutes), "minute")}`;


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
                <Grid item>
                    <IconLabeledText icon={<TimerIcon/>} label={durationUntilStr + " from now"}/>
                </Grid>
                <Grid item>
                    <IconLabeledText icon={<ScheduleIcon/>} label={section.time.start + " - " + section.time.end}/>
                </Grid>
                <Grid item>
                    <IconLabeledText icon={<SchoolIcon/>} label={course.prefix + " " + course.code + "." + section.number}/>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
        </AccordionDetails>
    </Accordion>
}
