export const buildingFloorRoomToStr = (building, floor, room) => `${building} ${floor}.${room}`;

export const strToBuildingFloorRoom = (str) => {
    const [building, floorRoom] = str.split(" ");
    const [floor, room] = floorRoom.split(".");
    return {building, floor, room};
}