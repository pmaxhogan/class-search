import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Container from '@mui/material/Container';

export default function MyApp({ Component, pageProps }) {
    return <Container>
        <Component {...pageProps} />
    </Container>
}