# class-search
## How to find
Orion -> my academics -> view my classes -> Search Schedule of classes
Subject: for each
- Uncheck show open classes only
- maximum units: less than or equal to 99.00

## TODO:
- [x] add fetch() with caching
- [ ] export to db
- [ ] make db mark all old classes as pendingRemoval, add new classes and unset pendingRemoval, then delete all pendingRemoval
- [ ] what is happening with mismatchIgnore? (why do json exports not include some classes?)
- [ ] what is a "stopped" section, and do they occupy an otherwise unoccupied room?
- [ ] what is a "None-enroll" course and does it occupy an otherwise unoccupied room?
- [ ] what is a "closed" course and does it occupy an otherwise unoccupied room?

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
Days
```js
{
    type: "none"
}
{
    type: "once",
    when: "2023-01-25" // YYYY-MM-DD
}
{
    type: "recurring",
    when: ["Monday", "Wednesday"]
}
```
Time
```
null
{
    start: "12:00pm",
    end: "2:15pm"
}
```

## Assumptions & limitations
- weird things happen after midnight
- a room number has a 1:1 relationship with an actual enclosed space
