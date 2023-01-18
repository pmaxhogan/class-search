import React from "react";
import {Grid, Typography} from "@mui/material";

export default function IconLabeledText({icon, label}) {
    return <Grid container spacing={2} direction="row">
        <Grid item>
            {icon}
        </Grid>
        <Grid item>
            <Typography>{label}</Typography>
        </Grid>
    </Grid>
}