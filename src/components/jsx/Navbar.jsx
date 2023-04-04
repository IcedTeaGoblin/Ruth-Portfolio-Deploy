import React, {useEffect, useState} from "react";
import "../css/Navbar.css";
import Logo from "../Images/Logo.png";
import {db} from "../../firebase-config"
import Modal from "react-modal";
import { ref, onValue } from "firebase/database";
import { NavLink, NavLinkProps } from "react-router-dom";


function Navbar() {

    const [user, setUser] = useState([]);

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [loggingInName, setLoggingInName] = useState("");
    const [loggingInPassword, setLoggingInPassword] = useState("");

    const [loggingInValid, setLoggingInValid] = useState(true);

    useEffect(() => {

        setLoggingInValid(loggingInName === "" || loggingInPassword === "");
        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));

    }, [loggingInName, loggingInPassword])

    function openLoggingIn()
    {
        setIsLoggingIn(true);
    }

    function closeLoggingIn()
    {
        setIsLoggingIn(false);
        setLoggingInName(null);
        setLoggingInPassword(null);
    }

    function attemptLogin()
    {
        onValue(ref(db, "Users"), snapshot =>
        {
            snapshot.forEach(n =>
            {
                if(n.val().name === loggingInName && n.val().password === loggingInPassword)
                {
                    localStorage.setItem("LoggedInUser", JSON.stringify(n.val()));
                    window.location.reload(false);
                }
            })
        })
    }

    function logOut()
    {
        localStorage.setItem("LoggedInUser", JSON.stringify(null));
        setUser(null);
        window.location.reload(false);
    }

    const addModalStyle = {
        content: {
            position: "initial",

            margin: "auto",
            marginTop: "200px",

            width: "fit-content",
            display: "flex",
            minWidth: "500px",
            backgroundColor: "#f8cde1",

            overflow: "auto",

            border: "3px solid rgb(176,84,117)"
        }
    }

    return (
        <div>
            <div className = "mainNavBar">
                <div className = "LogoTitle">
                    <img className = "Logo" src = {Logo} alt="Website logo"/>
                    <h1 className = "Title">Ruth's Art Portfolio</h1>
                </div>
                <NavLink to = "/about">About Me</NavLink>
                <NavLink to = "/home">Home</NavLink>
                {
                    user === null ?
                        <div className = "loginHeader">
                            <button className = "logoutButtonB" onClick = {openLoggingIn}>Login</button>
                        </div>
                    :
                        <div className = "loginHeader">
                            <h1 className = "logoutText">{user.name}</h1>
                            <button className = "logoutButtonB" onClick = {logOut}>Log out</button>
                        </div>
                }
            </div>

            <Modal style={addModalStyle} isOpen = {isLoggingIn} onRequestClose = {closeLoggingIn} ariaHideApp={false}>
                <div>
                    <h1 className = "loginTitle">Login</h1>
                    <div><input placeholder = "name..." onChange = {(event) => {(setLoggingInName(event.target.value))}}/></div>
                    <div><input placeholder = "password..." onChange = {(event) => {(setLoggingInPassword(event.target.value))}}/></div>
                    <div><button onClick = {attemptLogin} disabled = {loggingInValid}>Submit</button></div>
                </div>
            </Modal>
        </div>
    )
}

export default Navbar;