import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Container from '@mui/material/Container';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {LocalizationProvider} from "@mui/x-date-pickers";
import React, {Component} from "react";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import Disclaimer from "../components/Disclaimer";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function MyApp({Component, pageProps}) {
    return <ThemeProvider theme={darkTheme}>
        <Container>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <CssBaseline/>
                <Disclaimer/>
                <Component {...pageProps} />
            </LocalizationProvider>
        </Container>
    </ThemeProvider>;
};
