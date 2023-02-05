import {Card, CardContent, Stack} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function ErrorCard({text}) {
    return <Card variant="outlined" sx={{
        width: "100%",
        borderColor: "error.main",
    }}><CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
            <ErrorOutlineIcon color="error"/>
            <Typography color="error">
                {text}
            </Typography>
        </Stack>
    </CardContent></Card>
}