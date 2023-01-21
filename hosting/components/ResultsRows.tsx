// RoomMap.tsx component, has a buildingName prop, a floor prop, and a room prop

import React from "react";
import useSWR from "swr";
import ResultRow from "./ResultRow";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from '@mui/material/Card';
import Paper from "@mui/material/Paper";
import {green} from '@mui/material/colors';
import {Grid} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import IconLabeledText from "./IconLabeledText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getAllCrosslisted = (courses, course) => courses.filter(course2 => JSON.stringify(course2.courseSection.section.location) === JSON.stringify(course2.courseSection.section.location) && course.nextMeeting === course2.nextMeeting)

const endingTimeOfSection = previousResult => {
    const previousDate = previousResult.nextMeeting;
    let previousEnd = previousResult.courseSection.section.time.end;
    const isPm = previousEnd.includes("pm");
    previousEnd = previousEnd.replace("pm", "").replace("am", "").trim();
    const previousEndDateTime = new Date(previousDate);
    previousEndDateTime.setHours(parseInt(previousEnd.split(":")[0]) + (isPm ? 12 : 0));
    previousEndDateTime.setMinutes(parseInt(previousEnd.split(":")[1]));
    return previousEndDateTime;
};


export default function ResultsRows({roomName, startDate}) {

    const {
        data: studyResults,
        error: resultsError
    } = useSWR(`/api/study/room?room=${encodeURIComponent(roomName)}` + (startDate ? `&start=${startDate}` : ""), fetcher);

    if (resultsError) {
        return <p>Failed to load results :(</p>
    }

    let previousMeetingTime = null;
    if (studyResults) {
        const dedupedResults = studyResults?.filter(result => {
            result.key = result.nextMeeting + "_" + result.courseSection.course.title;
            if (previousMeetingTime === result.nextMeeting) {
                // console.log("deduping", result);
                return false;
            }
            previousMeetingTime = result.nextMeeting;
            return true;
        });

        const split = [];

        for (const result of dedupedResults) {
            const nextMeetingDate = new Date(result.nextMeeting);
            const dateString = (new Date(result.nextMeeting)).toLocaleDateString();
            const isNewDay = split[split.length - 1]?.date !== dateString;

            let showGap = false;
            let isInitial = false;
            let timeDelta;
            if (isNewDay) {
                const isToday = nextMeetingDate.toDateString() === new Date().toDateString();
                if (isToday) {
                    timeDelta = nextMeetingDate.getTime() - (new Date()).getTime();
                    showGap = true;
                    isInitial = true;
                }

                const dayOfWeek = isToday ? "Today" : nextMeetingDate.toLocaleDateString("en-US", {weekday: "long"});
                const isWithinAWeek = nextMeetingDate.getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 7;
                const date = isWithinAWeek ? dayOfWeek : nextMeetingDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });
                split.push({date: dateString, results: [], friendlyDate: date});
            } else {
                const previous = split[split.length - 1];
                const previousResult = previous.results[previous.results.length - 1].result;

                if (previousResult) {
                    const previousEndDateTime = endingTimeOfSection(previousResult);

                    timeDelta = nextMeetingDate.getTime() - previousEndDateTime.getTime();

                    if (timeDelta > 1000 * 60 * 15) {
                        showGap = true;
                    }
                }
            }

            if (showGap) {
                split[split.length - 1].results.push({gap: timeDelta, key: result.key + "_gap", isInitial});
            }

            split[split.length - 1].results.push({result});
        }


        return <div>{
            split.map(({ friendlyDate, results}) => <div key={friendlyDate}>
                <Typography component="h2" variant="h4" sx={{textAlign: "center", marginTop: "1rem", marginBottom: "1rem"}}>
                    {friendlyDate}
                </Typography>
                {results.map(item => {
                    const minutes = Math.round(item.gap / 1000 / 60);
                    const gap = minutes > 60 ? (Math.floor(minutes / 60) + " hour" + (minutes % 60 > 0 ? " " + (minutes % 60) + " minute" : "")) : minutes + " minute";
                    if (item.gap) {
                        return (
                            <Accordion sx={{backgroundColor: green[300]}} defaultExpanded>
                                <AccordionSummary>
                                    <IconLabeledText icon={<ScheduleIcon/>}
                                                     label={gap + " gap " + (item.isInitial ? " from now" : "")}/>
                                </AccordionSummary>
                            </Accordion>
                        );
                    } else {
                        return (<ResultRow key={item.result.key} results={getAllCrosslisted(studyResults, item.result)}/>);
                    }
                })}
            </div>
        )}</div>
    } else {
        return <p>Loading...</p>
    }
}
