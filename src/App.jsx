import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import './App.css'
import {createTheme, MantineProvider} from "@mantine/core";
import RouteService from "./routes/routeService.jsx";
import Footer from "./components/footer/footer.jsx";
import AppHeader from "./components/header/AppHeader.jsx";
import {AuthProvider} from "./GlobalConfig/AuthContext.jsx";

const myTheme = {
    breakpoints: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
    },
    containerSizes: {
        xs: '320px',
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
    },

    fontFamily: 'Bitter, sans-serif',
    headings: {
        fontFamily: 'Bitter, sans-serif',
        fontWeight: 700,
    },
    colors: {
        // Defina suas próprias cores aqui
        primary: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'],
        second: ['#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c'],
        yellow2: ['#ffffe0', '#fffacd', '#fff8dc', '#ffeb3b', '#ffd700', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00'],
        red: [
            '#ffebee', // Lightest red
            '#ffcdd2',
            '#ef9a9a',
            '#e57373',
            '#ef5350',
            '#f44336', // Base red
            '#e53935',
            '#d32f2f',
            '#c62828',
            '#b71c1c'  // Darkest red]
        ],
    },

    primaryColor: 'primary', // Defina a cor primária do seu tema
    secondaryColor: 'secondary',
};


function App() {

    return (
        <MantineProvider theme={myTheme}>
            <AuthProvider>
                <RouteService/>
                <Footer/>
            </AuthProvider>
        </MantineProvider>

    )
}

export default App
