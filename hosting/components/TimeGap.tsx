import {green} from "@mui/material/colors";
import AccordionSummary from "@mui/material/AccordionSummary";
import IconLabeledText from "./IconLabeledText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Accordion from "@mui/material/Accordion";
import React from "react";

export default function TimeGap({ gapItem }){
    const minutes = Math.round(gapItem.gap / 1000 / 60);
    const gap = minutes > 60 ? (Math.floor(minutes / 60) + " hour" + (minutes % 60 > 0 ? " " + (minutes % 60) + " minute" : "")) : minutes + " minute";

    return (<Accordion sx={{backgroundColor: green[300]}} defaultExpanded>
        <AccordionSummary>
            <IconLabeledText icon={<ScheduleIcon/>}
                             label={gap + " gap " + (gapItem.isInitial ? " from now" : "")}/>
        </AccordionSummary>
    </Accordion>);
}