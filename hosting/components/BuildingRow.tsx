import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Alert, Card, CardContent, CardHeader, Grid, Stack, useTheme} from "@mui/material";
import IconLabeledText from "./IconLabeledText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TimerIcon from "@mui/icons-material/Timer";
import AccordionDetails from "@mui/material/AccordionDetails";
import SchoolIcon from "@mui/icons-material/School";
import PortraitIcon from "@mui/icons-material/Portrait";
import RoomIcon from '@mui/icons-material/Room';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";
import {
    endingTimeOfSection,
    getStatusText,
    getWhenItOccurs,
    isoToDurationUntilString,
    timeAllowance
} from "../lib/dateTimeStuff";
import {strToBuildingFloorRoom} from "../lib/misc";
import FloorMapOfRoomCard from "./FloormapOfRoomCard";
import Button from "@mui/material/Button";
import useSWR from "swr";
import {fetcher} from "../lib/fetcher";
import ErrorCard from "./ErrorCard";

export default function BuildingRow({room, nextMeetings, startDate, searchRoom, expanded=false}) {
    const startDateAsDate = new Date(startDate || new Date().toISOString());
    const nextMeetingResult = nextMeetings[0];
    const {data: privateRooms, error: privateRoomsError} = useSWR(`/api/privaterooms`, fetcher);

    const isPrivateRoom = privateRooms?.includes(room);

    if (!nextMeetingResult) return null;

    const {nextMeeting, courseSection: {course, section}} = nextMeetingResult;

    console.log(new Date(nextMeeting).getTime(), startDateAsDate.getTime(), timeAllowance, startDate);
    const isBusy = new Date(nextMeeting).getTime() < startDateAsDate.getTime() + timeAllowance;

    let freeAt = null;
    if (isBusy) {
        for (const nextMeetingResult of nextMeetings) {
            const startsAt = new Date(nextMeetingResult.nextMeeting);
            if (freeAt && startsAt.getTime() > freeAt.getTime() + timeAllowance) {
                break;
            }
            freeAt = endingTimeOfSection(nextMeetingResult);
        }
    }

    const durationUntilStr = isoToDurationUntilString(nextMeeting, startDate);
    const whenItOccurs = getWhenItOccurs(nextMeetingResult);
    const statusText = getStatusText(nextMeetingResult);

    const courseString = course.prefix + " " + course.code + "." + section.number;

    // noinspection JSObjectNullOrUndefined
    const timerLabel = isBusy ? "busy for " + isoToDurationUntilString(freeAt.toISOString(), startDate) : "free for " + durationUntilStr;

    const {building, floor, room: roomNumber} = strToBuildingFloorRoom(room);

    const scheduleLabel = (section.time.start && section.time.end) ?
        courseString + " @ " + section.time.start + " - " + section.time.end :
        "unknown";

    const theme = useTheme();

    const style = (isPrivateRoom || privateRoomsError) ? {border: "1px solid " + theme.palette.warning.main} : {};

    return <Accordion defaultExpanded={expanded}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={style}
        >
            <Grid container spacing={2} direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<RoomIcon/>}
                                     label={room}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<TimerIcon/>} label={timerLabel ?? "unknown"}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <IconLabeledText icon={<ScheduleIcon/>}
                                     label={scheduleLabel}/>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <Stack direction="column" spacing={2}>
                {isPrivateRoom && <Alert severity="warning">This room is a private or lab room, and may be inaccessible to you.</Alert>}
                {privateRoomsError && <Alert severity="warning">Could not load room accessibility information.</Alert>}
                <Button variant="contained" size="large" onClick={() => searchRoom(room)} style={{width: "100%"}}>Search
                    Room</Button>
                <Grid container direction="row" spacing={2} alignItems="stretch">
                    <Grid item xs={12} md={6} style={{paddingRight: "16px", paddingLeft: "0"}}>
                        <Card style={{height: "100%"}} raised>
                            <CardHeader title="Next Class"/>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <IconLabeledText icon={<SchoolIcon/>} label={course.title ?? "Unknown Title"}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <IconLabeledText icon={<PortraitIcon/>}
                                                         label={section.instructor ?? "Unknown Instructor"}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <IconLabeledText icon={<CalendarMonthIcon/>}
                                                         label={whenItOccurs ?? "Unknown"}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <IconLabeledText icon={<InfoIcon/>}
                                                         label={statusText ?? "Unknown"} tooltip="Status"/>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} style={{paddingRight: "16px", paddingLeft: "0"}}>
                        <FloorMapOfRoomCard building={building} floor={floor} room={roomNumber} raised/>
                    </Grid>
                </Grid>
            </Stack>
        </AccordionDetails>
    </Accordion>
}