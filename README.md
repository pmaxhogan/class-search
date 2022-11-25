# class-search
## How to find
Orion -> my academics -> view my classes -> Search Schedule of classes
Subject: for each
- Uncheck show open classes only
- maximum units: less than or equal to 99.00

## TODO:
- [x] add fetch() with caching
- [ ] handle big classes
- [ ] export to db
- [ ] make db mark all old classes as pendingRemoval, add new classes and unset pendingRemoval, then delete all pendingRemoval
- [ ] what is a "stopped" section, and do they reserve rooms?

## Types
Location
```js
{
    type: "none"
}
{
    type: "special",
    room: "See instructor for room assignment"
}
{
    type: "room",
    building: "ECSW",
    floor: 5,
    room: "621"
}
```

## Assumptions & limitations
- weird things happen after midnight
- a room number has a 1:1 relationship with an actual enclosed space
