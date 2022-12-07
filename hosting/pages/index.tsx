import React, {useEffect, useState} from 'react'
import useSWR from "swr";
import FloorMapOfRoom from "../components/FloorMapOfRoom";
import ResultsRows from "../components/ResultsRows";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// @ts-ignore
const dedupe = arr => [...new Set(arr)];

function IndexPage() {
    const [buildingName, setBuildingName] = useState("");
    const [floor, setFloor] = useState("");
    const [room, setRoom] = useState("");

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
        return buildingName && floor && room && getFloorsFromBuilding(buildingName).includes(parseInt(floor)) && getRoomsFromBuildingFloor(buildingName, floor).includes(room);
    }

    function getFullRoomName(){
        return `${buildingName} ${floor}.${room}`;
    }

    const {data: buildings, error: roomsError} = useSWR(`/api/rooms`, fetcher);
    if (roomsError) return <main>Failed to load</main>
    if (!buildings) return <main>Loading...</main>

    return (
        <main>
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

            {isValid() && (<>
                <p>{getFullRoomName()}</p>
                <FloorMapOfRoom buildingName={buildingName} floor={floor} room={room}/>
                <p>Results</p>
                <ResultsRows roomName = {getFullRoomName()}/>
            </>)}
        </main>
    )
}



export default IndexPage


