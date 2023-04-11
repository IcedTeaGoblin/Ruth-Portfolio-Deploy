import {React, useState} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Navbar from "./components/jsx/Navbar.jsx";

import Home from "./components/jsx/Home.jsx";
import AboutMe from "./components/jsx/AboutMe.jsx";
import Header from "./components/jsx/Header.jsx";
import ViewArt from "./components/jsx/ViewArt.jsx";
import Commission from "./components/jsx/Commission.jsx";
import Footer from "./components/jsx/Footer.jsx";
import "./components/css/AppStyle.css";

const App = () => {

    const [artView, setArtView] = useState({name: "Gaming"});

    return (
        <div className = "mainDiv">
            <Router>
                <Header/>;
                <Navbar artViewFunction = {setArtView}/>
                <div className = "contentDiv">
                    <Routes>
                        <Route path = "/" element = {<Home/>}/>
                        <Route path = "/home" element={<Navigate replace to="/" />}/>
                        <Route path = "/about" element = {<AboutMe/>}/>
                        <Route path = "/view/:artName" element = {<ViewArt/>}/>
                        <Route path = "/commission" element = {<Commission/>}/>
                    </Routes>
                </div>
                <Footer/>
            </Router>
        </div>
    )
}

export default App;