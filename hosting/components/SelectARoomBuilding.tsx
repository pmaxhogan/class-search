import {Card, CardContent, Stack} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Typography from "@mui/material/Typography";
import React from "react";

export default function SelectARoomBuilding({isBuilding}) {
    return <Card>
        <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon/>

                <Typography>
                    Select a {isBuilding ? "room" : "building"}
                </Typography>
            </Stack>
        </CardContent>
    </Card>;
}