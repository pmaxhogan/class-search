// RoomMap.tsx component, has a buildingName prop, a floor prop, and a room prop

import React from "react";
import useSWR from "swr";
import ResultRow from "./ResultRow";
import Typography from "@mui/material/Typography";
import TimeGap from "./TimeGap";
import {endingTimeOfSection, timeAllowance} from "../lib/dateTimeStuff";
import {LinearProgress} from "@mui/material";
import ErrorCard from "./ErrorCard";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getAllCrosslisted = (courses, course) => courses.filter(course2 => JSON.stringify(course2.courseSection.section.location) === JSON.stringify(course2.courseSection.section.location) && course.nextMeeting === course2.nextMeeting)

const dedupeCrosslistedClasses = rows => {
    let previousMeetingTime = null;

    return rows?.filter(result => {
        result.key = result.nextMeeting + "_" + result.courseSection.course.title;
        if (previousMeetingTime === result.nextMeeting) {
            return false;
        }
        previousMeetingTime = result.nextMeeting;
        return true;
    });
}

const getResultRows = (dedupedResults, startDate) => {
    const resultRows = [];
    const studyingLater = startDate !== null;

    for (const result of dedupedResults) {
        const nextMeetingDate = new Date(result.nextMeeting);
        const dateString = (new Date(result.nextMeeting)).toLocaleDateString();
        const isNewDay = resultRows[resultRows.length - 1]?.date !== dateString;

        let showGap = false;
        let isInitial = false;
        let timeDelta;
        if (isNewDay) {
            const isToday = nextMeetingDate.toDateString() === (new Date()).toDateString();
            if (isToday && !studyingLater) {
                timeDelta = nextMeetingDate.getTime() - ((new Date())).getTime();
                if (timeDelta > 0) {
                    showGap = true;
                    isInitial = true;
                }
            }

            const dayOfWeek = isToday ? "Today" : nextMeetingDate.toLocaleDateString("en-US", {weekday: "long"});
            const isWithinAWeek = nextMeetingDate.getTime() - (new Date()).getTime() < 1000 * 60 * 60 * 24 * 7;
            const date = isWithinAWeek ? dayOfWeek : nextMeetingDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            });
            resultRows.push({date: dateString, results: [], friendlyDate: date});
        } else {
            const previous = resultRows[resultRows.length - 1];
            const previousResult = previous.results[previous.results.length - 1].result;

            if (previousResult) {
                const previousEndDateTime = endingTimeOfSection(previousResult);

                timeDelta = nextMeetingDate.getTime() - previousEndDateTime.getTime();

                if (timeDelta > timeAllowance) {
                    showGap = true;
                }
            }
        }

        if (showGap) {
            resultRows[resultRows.length - 1].results.push({gap: timeDelta, key: result.key + "_gap", isInitial});
        }

        resultRows[resultRows.length - 1].results.push({result});
    }

    return resultRows;
}


export default function RoomResultRows({roomName, startDate}) {

    const {
        data: studyResults,
        error: resultsError
    } = useSWR(`/api/study/room?room=${encodeURIComponent(roomName)}` + (startDate ? `&start=${startDate}` : ""), fetcher);

    if (resultsError) {
        return <ErrorCard text={"Failed to load results :C"}/>
    }

    if (studyResults) {
        const dedupedResults = dedupeCrosslistedClasses(studyResults);

        const resultRows = getResultRows(dedupedResults, startDate);


        return <div>{
            resultRows.map(({friendlyDate, results}) => <div key={friendlyDate}>
                    <Typography component="h3" variant="h3"
                                sx={{textAlign: "center", marginTop: "1rem", marginBottom: "1rem"}}>
                        {friendlyDate}
                    </Typography>
                    {results.map(item => {
                        if (item.gap) {
                            return (
                                <TimeGap gapItem={item} key={item.key}/>
                            );
                        } else {
                            return (
                                <ResultRow key={item.result.key} results={getAllCrosslisted(studyResults, item.result)}
                                           startDate={startDate}/>);
                        }
                    })}
                </div>
            )}</div>
    } else {
        return <LinearProgress/>
    }
}
