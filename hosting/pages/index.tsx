import React, {useState} from 'react'
import useSWR from "swr";
import RoomResultRows from "../components/RoomResultRows";
import {
    Alert,
    Autocomplete,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    LinearProgress,
    Stack,
    Switch,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {DateTime} from "luxon";
import BuildingResultRows from '../components/BuildingResultRows';
import {fetcher} from '../lib/fetcher';
import SelectARoomBuilding from "../components/SelectARoomBuilding";
import {buildingFloorRoomToStr, strToBuildingFloorRoom} from "../lib/misc";
import FloorMapOfRoomCard from "../components/FloormapOfRoomCard";
import ErrorCard from "../components/ErrorCard";
import Head from "next/head";

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

    const {data: privateRooms, error: privateRoomsError} = useSWR(`/api/privaterooms`, fetcher);


    function handleBuildingChange(_, newValue) {
        setBuildingName(newValue);
        setFloor(null);
        setRoom(null);
    }


    function searchRoom(room) {
        const {building, floor, room: roomNumber} = strToBuildingFloorRoom(room);
        setBuildingName(building);
        setFloor(floor);
        setRoom(roomNumber);
    }


    function handleFloorChange(_, newValue) {
        setFloor(newValue);
        setRoom(null);
    }

    function handleRoomChange(_, newValue) {
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

    const fullRoomName = buildingFloorRoomToStr(buildingName, floor, room);

    const laterDateIso = (isDateLater && laterDate) ? new Date(laterDate).toISOString() : null;

    const {data: buildings, error: roomsError} = useSWR(`/api/rooms`, fetcher);
    if (roomsError) return <ErrorCard text={"Failed to load rooms :C"}/>

    if (!buildings) return <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{height: "100vh"}}
    >
        <Grid item xs={12} sm={6} md={4}>
            <LinearProgress/>
        </Grid>
    </Grid>
        ;

    const pageTitleSuffix = room ? fullRoomName : buildingName ? buildingName : "";
    const pageTitle = `Study Room @ UTD${pageTitleSuffix ? " | " + pageTitleSuffix : ""}`;


    const isPrivateRoom = room && privateRooms && privateRooms.includes(fullRoomName);

    return (
        <main>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content="Find a study room at UTD"/>
                <meta property="og:title" content={pageTitle}/>
                <meta property="og:description" content="Find a study room at UTD"/>

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff"/>
            </Head>
            <Stack direction="column" spacing={2}>
                <Typography component="h1" variant="h1" sx={{textAlign: "center"}}>Study Room @ UTD</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{paddingLeft: "0", paddingRight: "16px"}}>
                        <Card>
                            <CardHeader title="Select Building or Room"/>
                            <CardContent>
                                <Stack direction="column" spacing={1}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Autocomplete size="small" value={buildingName}
                                                          onChange={handleBuildingChange}
                                                          options={buildings.map(building => building.building).sort()}
                                                          renderInput={(params) => <TextField {...params}
                                                                                              label="Building"
                                                                                              variant="outlined"/>}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            {buildingName &&
                                                <Autocomplete size="small" value={floor} onChange={handleFloorChange}
                                                              options={getFloorsFromBuilding(buildingName).sort().map(floor => floor.toString())}
                                                              renderInput={(params) => <TextField {...params}
                                                                                                  label="Floor (Optional)"
                                                                                                  variant="outlined"/>}/>}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            {floor &&
                                                <Autocomplete size="small" value={room} onChange={handleRoomChange}
                                                              options={getRoomsFromBuildingFloor(buildingName, floor).sort()}
                                                              renderInput={(params) => <TextField {...params}
                                                                                                  label="Room"
                                                                                                  variant="outlined"/>}/>}
                                        </Grid>
                                    </Grid>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="subtitle2">Study Now</Typography>
                                        <Switch
                                            checked={isDateLater}
                                            onChange={(_, newState) => setIsDateLater(newState)}
                                            inputProps={{'aria-label': 'controlled'}}
                                        />
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="subtitle2">Study Later</Typography>
                                            <Chip label="beta" color="warning" size="small"/>
                                        </Stack>
                                    </Stack>
                                    {isDateLater && <>
                                        <Card elevation={3}>
                                            <CardContent>
                                                <Typography variant="subtitle1">Study At</Typography>
                                                <DateTimePicker
                                                    renderInput={(props) => <TextField {...props} />}
                                                    label="Select a date"
                                                    value={dateElementVal}
                                                    onChange={(changedDate) => {
                                                        setDateElementVal(changedDate);
                                                        setLaterDate(changedDate ? changedDate.toISO() : null);
                                                        setDateIsValid(changedDate.isValid);
                                                    }}
                                                    mask="__/__/____ __:__ _M"
                                                    minDateTime={DateTime.now()}
                                                />
                                            </CardContent>
                                        </Card>
                                    </>}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} style={{paddingRight: "16px", paddingLeft: "0"}}>
                        {isValid() && floor && room &&
                            <FloorMapOfRoomCard building={buildingName} floor={floor} room={room}/>
                        }
                    </Grid>
                </Grid>

                {privateRoomsError && <Alert severity="warning">Could not load room accessibility information.</Alert>}

                {isValid() ? (
                    (floor && room) ? <>
                        {isPrivateRoom &&
                            <Alert severity="warning">This room is a private or lab room, and may be inaccessible to you.</Alert>}
                        <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>Next Classes</Typography>
                        <RoomResultRows roomName={fullRoomName} startDate={laterDateIso}/>
                    </> : <>
                        <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>Rooms
                            in {buildingName}</Typography>
                        <BuildingResultRows buildingName={buildingName}
                                            rooms={buildings.find(building => building.building === buildingName).rooms}
                                            startDate={laterDateIso} searchRoom={searchRoom}/>
                    </>
                ) : (dateIsValid ? <SelectARoomBuilding isBuilding={!!buildingName}/> : <p>Invalid date</p>)
                }
            </Stack>
        </main>
    )
}


export default IndexPage


