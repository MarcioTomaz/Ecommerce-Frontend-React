import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import './GlobalConfig/i18n.js';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <QueryClientProvider client={client}>
            <App/>
        </QueryClientProvider>
    </>,
)
