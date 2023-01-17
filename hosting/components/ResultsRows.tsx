// RoomMap.tsx component, has a buildingName prop, a floor prop, and a room prop

import React from "react";
import useSWR from "swr";
import ResultRow from "./ResultRow";

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function ResultsRows({ roomName, startDate }) {

    const {data: studyResults, error: resultsError} = useSWR(`/api/study/room?room=${encodeURIComponent(roomName)}` + (startDate ? `&start=${startDate}` : ""), fetcher);

    if(resultsError){
        return <p>Failed to load results :(</p>
    }

    let previousMeetingTime = null;
    if(studyResults) {
        return <ul>{studyResults?.filter(result => {
            if(previousMeetingTime === result.nextMeeting){
                console.log("deduping", result);
                return false;
            }
            previousMeetingTime = result.nextMeeting;
            return true;
        }).map(result => (<ResultRow key={result.nextMeeting + "_" + result.courseSection.course.title} result={result}/>))}</ul>
    }else{
        return <p>Loading...</p>
    }
}
