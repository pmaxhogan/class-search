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
import {isoToDurationUntilString, getWhenItOccurs, getStatusText} from "../lib/dateTimeStuff";



export default function ResultRow({results}) {
    const result = results[0];
    const durationUntilStr = isoToDurationUntilString(result.nextMeeting);

    const statusText = getStatusText(result);

    const whenItOccurs = getWhenItOccurs(result);

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
                    <IconLabeledText icon={<TimerIcon/>} label={durationUntilStr + " from now"}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<NumbersIcon/>}
                                     label={results.map(result => course.prefix + " " + course.code + "." + section.number).join(", ")}/>
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
