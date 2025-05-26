import React, {useEffect} from 'react';
import {isUserLoggedIn} from "../hooks/api.jsx";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {


        if(!isUserLoggedIn()){
            navigate("/login");
        }

    }, []);

    return (
        <>
            <h1>Home Page</h1>
        </>

    )
}

export default Home;