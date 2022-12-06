// RoomMap.tsx component, has a buildingName prop, a floor prop, and a room prop

import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ResultsRows({ roomName }) {

    const {data: studyResults, error: resultsError} = useSWR(`/api/study/room?room=${encodeURIComponent(roomName)}`, fetcher);

    if(resultsError){
        return <p>Failed to load results :(</p>
    }

    return <>{studyResults?.map(result => (<p>{JSON.stringify(result)}</p>))}</>
}
