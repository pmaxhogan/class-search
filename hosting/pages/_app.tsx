import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Container from "@mui/material/Container";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {LocalizationProvider} from "@mui/x-date-pickers";
import React, {Component, useEffect, useState} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {AppBar, CssBaseline, Fab, ListItemIcon, ListItemText, Menu, MenuItem, styled, Toolbar} from "@mui/material";
import Disclaimer from "../components/Disclaimer";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import {Check} from "@mui/icons-material";
import MenuList from "@mui/material/MenuList";
import HomeIcon from '@mui/icons-material/Home';
import {useRouter} from "next/router";
import {ScrollTop} from "../components/ScrollTop";
import {themes} from "../lib/themes";

const Offset = styled("div")(({theme}) => theme.mixins.toolbar);


export default function MyApp({Component, pageProps}) {
    const [currentTheme, setCurrentTheme] = useState(themes[0]);
    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (themeToSet) => {
        setAnchorEl(null);
        if (themeToSet) {
            setCurrentTheme(themes.find(theme => theme.name === themeToSet));
            localStorage.setItem("theme", themeToSet);
        }
    };

    useEffect(() => {
        const themeText = localStorage.getItem("theme");
        if (themeText) {
            setCurrentTheme(themes.find(theme => theme.name === themeText));
        }
    });


    const themeObj = createTheme({
        palette: currentTheme.options
    });

    return <ThemeProvider theme={themeObj}>
        <AppBar position="fixed">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => router.push("/")}
                >
                    <HomeIcon/>
                </IconButton>
                <Button
                    onClick={() => router.push("/about")}
                    color="inherit"
                >
                    About
                </Button>
                <div style={{flexGrow: 1}}/>
                <Button
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    color="inherit"
                >
                    Theme
                </Button>
                <MenuList dense>
                    <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => handleClose(null)}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        {themes.map((theme) => theme === currentTheme ?
                            <MenuItem key={theme.name} onClick={() => handleClose(null)}>
                                <ListItemIcon>
                                    <Check/>
                                </ListItemIcon>
                                {theme.name}
                            </MenuItem> : <MenuItem key={theme.name} onClick={() => handleClose(theme.name)}>
                                <ListItemText inset>{theme.name}</ListItemText>
                            </MenuItem>
                        )}
                    </Menu>
                </MenuList>
            </Toolbar>
        </AppBar>
        <Offset id="back-to-top-anchor"/>
        <Container>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <CssBaseline/>
                <Disclaimer/>
                <Component {...pageProps} />
            </LocalizationProvider>
        </Container>
        <ScrollTop>
            <Fab size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon/>
            </Fab>
        </ScrollTop>
    </ThemeProvider>;
}
;
