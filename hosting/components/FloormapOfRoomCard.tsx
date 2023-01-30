import {Card, CardContent, CardHeader} from "@mui/material";
import FloorMapOfRoom from "./FloorMapOfRoom";
import React from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function FloorMapOfRoomCard({building, floor, room, raised = false}) {
    return <Card raised={raised}>
        <CardHeader title={<><LocationOnIcon/> {building} {floor}.{room}</>}/>
        <CardContent>
            <FloorMapOfRoom buildingName={building} floor={floor} room={room}/>
        </CardContent>
    </Card>
}