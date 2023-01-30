import React from "react";
import {Stack, Tooltip, Typography} from "@mui/material";

export default function IconLabeledText({icon, label, tooltip = ""}) {
    return <Stack direction="row" spacing={1} alignItems="center">
        {tooltip ? <Tooltip title={tooltip}>{icon}</Tooltip> :
            icon}
        <Typography>{label}</Typography>
    </Stack>
}