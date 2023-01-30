import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {buildingFloorRoomToStr} from "../lib/misc";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Stack} from "@mui/material";


export default function FloorMapOfRoom({buildingName, floor, room}) {
    const [errored, setErrored] = useState(false);

    function openImage() {
        window.open(`https://locator.utdallas.edu/${buildingName}_${floor}.${room}`, "_blank");
    }

    useEffect(() => {
        setErrored(false);
    }, [buildingName, floor, room]);

    const str = buildingFloorRoomToStr(buildingName, floor, room);

    return <div>
        <a onClick={openImage}>
            <Stack spacing={1}>
                {errored ? <Typography>Failed to load map preview</Typography> :
                    <Button variant="text" style={{alignSelf: "baseline"}}><img
                        src={`https://dygz37jdyaml.cloudfront.net/images/utd-room-maps-2021-05-04/${buildingName}_${floor}.${room}.png`}
                        alt="map" onError={() => setErrored(true)}
                        style={{cursor: "pointer", display: "block"}}/></Button>}
                <Button variant="contained" endIcon={<OpenInNewIcon/>}>Locate Room on Map</Button>
            </Stack>
        </a>
    </div>;
}