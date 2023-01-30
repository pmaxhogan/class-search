import useSWR from "swr";
import {fetcher} from "../lib/fetcher";
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
        const {
            data,
            error
        } = useSWR(`/api/study/room?room=${encodeURIComponent(roomStr)}` + (startDate ? `&start=${startDate}` : ""), fetcher);
        roomSections.push({roomStr, data, error});
    });

    console.log("room", roomSections[0]);

    return <div>{
        roomSections.sort(compareSections).map(room => room.data &&
            <BuildingRow room={room.roomStr} nextMeetings={room.data} key={room.roomStr} startDate={startDate}/>
        )
    }</div>;
}