import React, {useEffect, useState} from 'react'
import useSWR from "swr";
import FloorMapOfRoom from "../components/FloorMapOfRoom";
import ResultsRows from "../components/ResultsRows";
import Disclaimer from "../components/Disclaimer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// @ts-ignore
const dedupe = arr => [...new Set(arr)];

function IndexPage() {
    const [buildingName, setBuildingName] = useState("");
    const [floor, setFloor] = useState("");
    const [room, setRoom] = useState("");
    const [isDateLater, setIsDateLater] = useState(false);
    const [laterDate, setLaterDate] = useState(null);

    // @ts-ignore
    const dateIsValid = !isNaN(new Date(laterDate));

    const dateClass = dateIsValid ? "" : "invalid";

    function handleBuildingChange(e) {
        setBuildingName(e.target.value);
    }
    function handleFloorChange(e) {
        setFloor(e.target.value);
    }
    function handleRoomChange(e) {
        setRoom(e.target.value);
    }
    function getFloorsFromBuilding(buildingName){
        const building = buildings.find(building => building.building === buildingName);
        return dedupe(building.rooms.map(room => room.floor));
    }
    function getRoomsFromBuildingFloor(buildingName, floor){
        const building = buildings.find(building => building.building === buildingName);
        return dedupe(building.rooms.filter(building => building.floor.toString() === floor).map(room => room.room));
    }

    function isValid(){
        return dateIsValid && buildingName && floor && room && getFloorsFromBuilding(buildingName).includes(parseInt(floor)) && getRoomsFromBuildingFloor(buildingName, floor).includes(room);
    }

    const fullRoomName =`${buildingName} ${floor}.${room}`;

    const laterDateIso = laterDate ? new Date(laterDate).toISOString() : null;

    const {data: buildings, error: roomsError} = useSWR(`/api/rooms`, fetcher);
    if (roomsError) return <main>Failed to load</main>
    if (!buildings) return <main>Loading...</main>

    return (
        <main>
            <Disclaimer/>

            <h1>Find Study Rooms In</h1>
            <select value={buildingName} onChange={handleBuildingChange}>
                <option value="">Select a building</option>
                {buildings.map(building => building.building).sort().map(building => (<option value={building} key={building}>{building}</option>))}
            </select>
            {buildingName && <select value={floor} onChange={handleFloorChange}>
                <option value="">Select a floor</option>
                {getFloorsFromBuilding(buildingName).map(floor => (<option value={floor} key={floor}>{floor}</option>))}
            </select>}
            {floor && <select value={room} onChange={handleRoomChange}>
                <option value="">Select a room</option>
                {getRoomsFromBuildingFloor(buildingName, floor).map(room => (<option value={room} key={room}>{room}</option>))}
            </select>}

            <br/>
            <button onClick={() => setIsDateLater(false)} disabled={!isDateLater}>Study Now</button>
            <button onClick={() => setIsDateLater(true)} disabled={isDateLater}>Study Later</button>
            {isDateLater && <>
                <h2>Study At</h2>
                <input type="datetime-local" value={laterDate} className={dateClass} onChange={e => setLaterDate(e.target.value)}/>
            </>}

            {isValid() ? (<>
                <p>{fullRoomName}</p>
                <FloorMapOfRoom buildingName={buildingName} floor={floor} room={room}/>
                <ResultsRows roomName = {fullRoomName} startDate={laterDateIso}/>
            </>) : (dateIsValid ? <p>Invalid room</p> : <p>Invalid date</p>)
            }
        </main>
    )
}



export default IndexPage


