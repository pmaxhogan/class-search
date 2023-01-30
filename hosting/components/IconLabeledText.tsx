import React from "react";
import {Grid, Tooltip, Typography} from "@mui/material";

export default function IconLabeledText({icon, label, tooltip = ""}) {
    return <Grid container spacing={2} direction="row">
        <Grid item>
            {tooltip ? <Tooltip title={tooltip}>{icon}</Tooltip> :
            icon}
        </Grid>
        <Grid item>
            <Typography>{label}</Typography>
        </Grid>
    </Grid>
}