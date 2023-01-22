// RoomMap.tsx component, has a buildingName prop, a floor prop, and a room prop

import React, {useEffect, useState} from "react";


export default function FloorMapOfRoom({buildingName, floor, room}) {
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        setErrored(false);
    }, [buildingName, floor, room]);

    if (errored) {
        return <p>Failed to load floor map, good luck!</p>
    }
    return <img
        src={`https://dygz37jdyaml.cloudfront.net/images/utd-room-maps-2021-05-04/${buildingName}_${floor}.${room}.png`}
        alt="map" onError={() => setErrored(true)}/>
}
