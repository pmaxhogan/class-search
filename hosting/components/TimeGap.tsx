import AccordionSummary from "@mui/material/AccordionSummary";
import IconLabeledText from "./IconLabeledText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Accordion from "@mui/material/Accordion";
import React from "react";
import {useTheme} from "@mui/material";

export default function TimeGap({gapItem}) {
    const minutes = Math.round(gapItem.gap / 1000 / 60);
    const gap = minutes > 60 ? (Math.floor(minutes / 60) + " hour" + (minutes % 60 > 0 ? " " + (minutes % 60) + " minute" : "")) : minutes + " minute";
    const theme = useTheme();

    return (<Accordion sx={{backgroundColor: theme.palette.success.main}} defaultExpanded>
        <AccordionSummary>
            <IconLabeledText icon={<ScheduleIcon/>}
                             label={gap + " gap " + (gapItem.isInitial ? " beginning now" : "")}/>
        </AccordionSummary>
    </Accordion>);
}