import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Container from '@mui/material/Container';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {LocalizationProvider} from "@mui/x-date-pickers";


export default function MyApp({Component, pageProps}) {
    return <Container>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <Component {...pageProps} />
        </LocalizationProvider>
    </Container>
}