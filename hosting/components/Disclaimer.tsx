import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function Disclaimer() {
    const [open, setOpen] = React.useState(localStorage.getItem("disclaimerAck") !== "true");
    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("disclaimerAck", "true");
    }


    return (
        <Modal open={open} >
            <Box sx={style}>
                <Typography variant="h3" component="h2">
                    Disclaimer
                </Typography>
                <Typography variant="h5">
                    <ul>
                        <li>Data is provided on a best-effort from CourseBook, and may be <b>out of date or wrong</b></li>
                        <li>A room may appear available but be in use by a class, professor, TA, staff, etc.</li>
                        <li>Please be respectful to others and be <b>quiet</b> if others are nearby</li>
                    </ul>
                </Typography>
                <Button variant="contained" onClick={handleClose} size="large">Got it</Button>
            </Box>
        </Modal>
    )
}