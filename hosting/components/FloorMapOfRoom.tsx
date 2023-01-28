// RoomMap.tsx component, has a buildingName prop, a floor prop, and a room prop

import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";


export default function FloorMapOfRoom({buildingName, floor, room}) {
    const [errored, setErrored] = useState(false);

    function openImage(){
        window.open(`https://locator.utdallas.edu/${buildingName}_${floor}.${room}`, "_blank");
    }

    useEffect(() => {
        setErrored(false);
    }, [buildingName, floor, room]);

    if (errored) {
        return <p>Failed to load floor map, good luck!</p>
    }
    return <a onClick={openImage}>
        <img
        src={`https://dygz37jdyaml.cloudfront.net/images/utd-room-maps-2021-05-04/${buildingName}_${floor}.${room}.png`}
        alt="map" onError={() => setErrored(true)} style={{cursor: "pointer", display: "block"}}/>
        <Button variant="contained">Locate Room on Map</Button>
    </a>
}