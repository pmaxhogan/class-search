import React, {useState} from 'react'
import useSWR from "swr";
import FloorMapOfRoom from "../components/FloorMapOfRoom";
import RoomResultRows from "../components/RoomResultRows";
import Disclaimer from "../components/Disclaimer";
import {Autocomplete, Grid, MenuItem, Stack, Switch, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {DateTime} from "luxon";
import BuildingResultRows from '../components/BuildingResultRows';
import { fetcher } from '../lib/fetcher';

// @ts-ignore
const dedupe = arr => [...new Set(arr)];

function IndexPage() {
    const [buildingName, setBuildingName] = useState(null);
    const [floor, setFloor] = useState(null);
    const [room, setRoom] = useState(null);
    const [isDateLater, setIsDateLater] = useState(false);
    const [laterDate, setLaterDate] = useState(null);
    const [dateElementVal, setDateElementVal] = useState(null);
    const [dateIsValid, setDateIsValid] = useState(true);


    const dateClass = dateIsValid ? "" : "invalid";

    function handleBuildingChange(_, newValue) {
        console.log("building changed", newValue);
        setBuildingName(newValue);
        setFloor(null);
        setRoom(null);
    }

    function handleFloorChange(_, newValue) {
        console.log("floor changed", newValue);
        setFloor(newValue);
        setRoom(null);
    }

    function handleRoomChange(_, newValue) {
        console.log("room changed", newValue);
        setRoom(newValue);
    }

    function getFloorsFromBuilding(buildingName) {
        const building = buildings.find(building => building.building === buildingName);
        return dedupe(building.rooms.map(room => room.floor));
    }

    function getRoomsFromBuildingFloor(buildingName, floor) {
        const building = buildings.find(building => building.building === buildingName);
        return dedupe(building.rooms.filter(building => building.floor.toString() === floor).map(room => room.room));
    }

    function isValid() {
        return dateIsValid && buildingName && ((!floor && !room) || (floor && room && getFloorsFromBuilding(buildingName).includes(parseInt(floor)) && getRoomsFromBuildingFloor(buildingName, floor).includes(room)));
    }

    const fullRoomName = `${buildingName} ${floor}.${room}`;

    const laterDateIso = laterDate ? new Date(laterDate).toISOString() : null;

    const {data: buildings, error: roomsError} = useSWR(`/api/rooms`, fetcher);
    if (roomsError) return <main>Failed to load</main>
    if (!buildings) return <main>Loading...</main>

    return (
        <main>
            <Disclaimer/>

            <Typography component="h1" variant="h1" sx={{textAlign: "center"}}>Search Building or Room</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete size="small" value={buildingName} onChange={handleBuildingChange}
                                  options={buildings.map(building => building.building).sort()}
                                  renderInput={(params) => <TextField {...params} label="Building"
                                                                      variant="outlined"/>}/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                    {buildingName && <Autocomplete size="small" value={floor} onChange={handleFloorChange}
                                                   options={getFloorsFromBuilding(buildingName).sort().map(floor => floor.toString())}
                                                   renderInput={(params) => <TextField {...params} label="Floor"
                                                                                       variant="outlined"/>}/>}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                    {floor && <Autocomplete size="small" value={room} onChange={handleRoomChange}
                                            options={getRoomsFromBuildingFloor(buildingName, floor).sort()}
                                            renderInput={(params) => <TextField {...params} label="Room"
                                                                                variant="outlined"/>}/>}
                        </Grid>
                    </Grid>


                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2">Study Now</Typography>
                        <Switch
                            checked={isDateLater}
                            onChange={(_, newState) => setIsDateLater(newState)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography variant="subtitle2">Study Later</Typography>
                    </Stack>
                    {isDateLater && <>
                        <Typography variant="subtitle1">Study At</Typography>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="DateTimePicker"
                            value={dateElementVal}
                            onChange={(changedDate) => {
                                setDateElementVal(changedDate );
                                setLaterDate(changedDate ? changedDate.toISO() : null);
                                setDateIsValid(changedDate.isValid);
                            }}
                            mask="__/__/____ __:__ _M"
                            minDateTime={DateTime.now()}
                        />
                    </>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {isValid() && floor && room && <><p>{fullRoomName}</p>
                        <FloorMapOfRoom buildingName={buildingName} floor={floor} room={room}/>
                    </>
                    }
                </Grid>
            </Grid>

            {isValid() ? (
                (floor && room) ? <>
                    <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>Next Classes</Typography>
                    <RoomResultRows roomName={fullRoomName} startDate={laterDateIso}/>
                </> : <>
                    <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>Rooms in {buildingName}</Typography>
                    <BuildingResultRows buildingName={buildingName} rooms={buildings.find(building => building.building === buildingName).rooms}/>
                </>
            ) : (dateIsValid ? <p>Select a room</p> : <p>Invalid date</p>)
            }
        </main>
    )
}


export default IndexPage


