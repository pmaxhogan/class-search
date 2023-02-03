import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Container from "@mui/material/Container";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {LocalizationProvider} from "@mui/x-date-pickers";
import React, {Component, useEffect, useState} from "react";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {
    AppBar,
    CssBaseline,
    Fab,
    Fade,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    styled,
    Toolbar
} from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Disclaimer from "../components/Disclaimer";
import Box from "@mui/material/Box";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import useLocalStorage from "../lib/useLocalStorage";
import {Check} from "@mui/icons-material";
import MenuList from "@mui/material/MenuList";
import {PaletteOptions} from "@mui/material/styles/createPalette";

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won"t need it on your project.
     */
    window?: () => Window;
    children: React.ReactElement;
}

function ScrollTop(props: Props) {
    const {children, window} = props;
    // Note that you normally won"t need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = (
            (event.target as HTMLDivElement).ownerDocument || document
        ).querySelector("#back-to-top-anchor");

        if (anchor) {
            anchor.scrollIntoView({
                block: "center",
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{position: "fixed", bottom: 16, right: 16}}
            >
                {children}
            </Box>
        </Fade>
    );
}

const Offset = styled("div")(({theme}) => theme.mixins.toolbar);

type ThemeOptions = {
    options: PaletteOptions,
    name: string
}

const themes: ThemeOptions[] = [
    {
        name: "Dark",
        options: {
            mode: "dark"
        }
    },
    {
        name: "Light",
        options: {
            mode: "light"
        },
    },
    {
        name: "Blue",
        options: {
            mode: "dark",
            primary: {
                main: '#ffffff',
            },
            secondary: {
                main: '#fabb2f',
            },
            background: {
                default: '#040e24',
                paper: '#032d58',
            }
        },
    },
    {
        name: "Purple",
        options: {
            mode: "dark",
            primary: {
                main: '#ffffff',
            },
            secondary: {
                main: '#63fc30',
            },
            background: {
                default: '#1b052f',
                paper: '#2b074d',
            }
        }
    }];


export default function MyApp({Component, pageProps}) {
    const [currentTheme, setCurrentTheme] = useState(themes[0]);

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
                >
                    <MenuIcon/>
                </IconButton>
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
