import useSWR from "swr";
import {fetcherMultiple} from "../lib/fetcher";
import BuildingRow from "./BuildingRow";
import {buildingFloorRoomToStr} from "../lib/misc";

const compareSections = (a, b) => {
    if (a && a.data && a.data.length && b && b.data && b.data.length) {
        return new Date(a.data[0].nextMeeting).getTime() - new Date(b.data[0].nextMeeting).getTime();
    } else if (a && a.data && a.data.length) {
        return -1;
    } else {
        return 1;
    }
};

export default function BuildingResultRows({buildingName, rooms, startDate}) {
    const roomSections = [];
    rooms.forEach(room => {
        const roomStr = buildingFloorRoomToStr(room.building, room.floor, room.room);
        roomSections.push({roomStr, data: null, error: null});
    });
    const {data, error} = useSWR({urls: roomSections.map(section => `/api/study/room?room=${encodeURIComponent(section.roomStr)}` + (startDate ? `&start=${startDate}` : ""))}, fetcherMultiple);
    roomSections.forEach((section, idx) => data && (section.data = data[idx]));

    return <div>{
        roomSections.sort(compareSections).map(room => room.data &&
            <BuildingRow room={room.roomStr} nextMeetings={room.data} key={room.roomStr} startDate={startDate}/>
        )
    }</div>;
}