import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import './App.css';
import RouteService from './routes/routeService.jsx';
import Footer from './components/footer/footer.jsx';
import {AuthProvider} from './GlobalConfig/AuthContext.jsx';
import './GlobalConfig/i18n.js';


function App() {

    return (
        <AuthProvider>
            <RouteService/>
            <Footer/>
        </AuthProvider>
    );
}

export default App;