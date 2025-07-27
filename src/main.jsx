import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './GlobalConfig/i18n.js';
import { createTheme, Loader, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

// Importe os estilos do Mantine Core e do Notifications
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';


const client = new QueryClient();

const myThemeBase = {
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
        primary: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'],
        second: ['#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c'],
        yellow2: ['#ffffe0', '#fffacd', '#fff8dc', '#ffeb3b', '#ffd700', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00'],
        red: [
            '#ffebee',
            '#ffcdd2',
            '#ef9a9a',
            '#e57373',
            '#ef5350',
            '#f44336',
            '#e53935',
            '#d32f2f',
            '#c62828',
            '#b71c1c'
        ],
    },
    primaryColor: 'primary',
};

const theme = createTheme({
    ...myThemeBase,
    defaultColorScheme: 'dark',
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <Suspense fallback={<Loader />}>
                <QueryClientProvider client={client}>
                    <App />
                </QueryClientProvider>
            </Suspense>
        </MantineProvider>
    </>
);
