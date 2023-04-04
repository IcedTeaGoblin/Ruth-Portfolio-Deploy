import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Navbar from "./components/jsx/Navbar.jsx";

import Home from "./components/jsx/Home.jsx"
import AboutMe from "./components/jsx/AboutMe.jsx"
import "./components/css/AppStyle.css";

const App = () => {
    return (
        <div className = "mainDiv">
            <Router>
                <img className = "header" src = {require("./components/Images/Header.jpg")} alt="Header for the website"/>
                <Navbar/>
                <div className = "contentDiv">
                    <Routes>
                        <Route path = "/" element = {<Home/>}/>
                        <Route path = "/home" element={<Navigate replace to="/" />}/>
                        <Route path = "about" element = {<AboutMe/>}/>
                    </Routes>
                </div>
                <img className = "footer" src = {require("./components/Images/Footer.jpg")} alt="Footer for the website"/>
            </Router>
        </div>
    )
}

export default App;