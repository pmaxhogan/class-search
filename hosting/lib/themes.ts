import {PaletteOptions} from "@mui/material/styles/createPalette";

type ThemeOptions = {
    options: PaletteOptions,
    name: string
}
export const themes: ThemeOptions[] = [
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