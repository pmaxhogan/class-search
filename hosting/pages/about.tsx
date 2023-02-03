import Typography from "@mui/material/Typography";
import React from "react";
import {Stack} from "@mui/material";

export default function DayPage() {
    return <main>
        <Stack direction="column" spacing={2}>
            <Typography component="h1" variant="h1" sx={{textAlign: "center"}}>About</Typography>
            <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>What is this?</Typography>
            <Typography component="p" variant="body1" sx={{textAlign: "center"}}>
                This is a website that allows you find open rooms to study at UTD. This website is not affiliated with UTD.
            </Typography>
            <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>Who made it?</Typography>
            <Typography component="p" variant="body1" sx={{textAlign: "center"}}>
                This website was made by <a href="http://maxhogan.dev/" style={{color: "inherit"}}>Max Hogan</a>! It is open source and can be found on <a href="https://github.com/pmaxhogan/class-search" style={{color: "inherit"}}>GitHub</a>.
            </Typography>
            <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>How does it work?</Typography>
            <Typography component="p" variant="body1" sx={{textAlign: "center"}}>
                CourseBook is periodically scraped to get all of the class sections. Next.js with React is used to render the website. The website is hosted on Firebase.
            </Typography>
            <Typography component="h2" variant="h2" sx={{textAlign: "center"}}>Why is it wrong?</Typography>
            <Typography component="p" variant="body1" sx={{textAlign: "center"}}>
                This website is not perfect. It is not guaranteed to be accurate. This website takes information from CourseBook, which is not guaranteed to be accurate or up to date.
                If you find a bug, please email me at <a href="mailto:max@maxhogan.dev" style={{color: "inherit"}}>max@maxhogan.dev</a>.
            </Typography>
        </Stack>
    </main>
}
