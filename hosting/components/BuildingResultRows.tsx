import useSWR from "swr";
import * as React from 'react';
import {fetcherMultiple} from "../lib/fetcher";
import BuildingRow from "./BuildingRow";
import {buildingFloorRoomToStr} from "../lib/misc";
import {LinearProgress, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import TimerIcon from '@mui/icons-material/Timer';
import ErrorCard from "./ErrorCard";

export default function BuildingResultRows({buildingName, rooms, startDate, searchRoom}) {
    const [sortMode, setSortMode] = React.useState("a-z");

    function compareSections(a, b) {
        if (sortMode === "a-z") {
            return a.roomStr.localeCompare(b.roomStr);
        } else {
            if (a && a.data && a.data.length && b && b.data && b.data.length) {
                return new Date(b.data[0].nextMeeting).getTime() - new Date(a.data[0].nextMeeting).getTime();
            } else if (a && a.data && a.data.length) {
                return -1;
            } else {
                return 1;
            }
        }
    }

    const roomSections = [];
    rooms.forEach(room => {
        const roomStr = buildingFloorRoomToStr(room.building, room.floor, room.room);
        roomSections.push({roomStr, data: null, error: null});
    });
    const {
        data,
        error
    } = useSWR({urls: roomSections.map(section => `/api/study/room?room=${encodeURIComponent(section.roomStr)}` + (startDate ? `&start=${startDate}` : ""))}, fetcherMultiple);
    roomSections.forEach((section, idx) => data && (section.data = data[idx]));

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newVal: string | null,
    ) => {
        if (newVal !== null) {
            setSortMode(newVal);
        }
    };

    if (error) {
        return <ErrorCard text={"Error loading building rooms :C"}/>
    }

    return data ? <Stack spacing={2}>
        <ToggleButtonGroup
            value={sortMode}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
        >
            <ToggleButton value="a-z" aria-label="sort A through Z">
                <SortByAlphaIcon/>
            </ToggleButton>
            <ToggleButton value="time" aria-label="sort by time">
                <TimerIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
        <div>
            {roomSections.sort(compareSections).map(room => room.data &&
                <BuildingRow room={room.roomStr} nextMeetings={room.data} key={room.roomStr} startDate={startDate}
                             searchRoom={searchRoom}/>
            )}
        </div>
    </Stack> : <LinearProgress/>;
}