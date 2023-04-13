import React, {useEffect, useState} from "react";
import "../css/Navbar.css";
import {db} from "../../firebase-config"
import Modal from "react-modal";
import { ref, onValue, set, get } from "firebase/database";
import { NavLink} from "react-router-dom";


function Navbar() {

    const [user, setUser] = useState([]);

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [loggingInName, setLoggingInName] = useState("");
    const [loggingInPassword, setLoggingInPassword] = useState("");

    const [loggingInValid, setLoggingInValid] = useState(true);

    const [isSigningUp, setIsSigningUp] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");

    const [signUpValid, setSignUpValid] = useState(true);

    useEffect(async() => {

        setLoggingInValid(loggingInName === "" || loggingInPassword === "");
        setSignUpValid(newUserName === "" || newUserPassword === "");
        try
        {
            await setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
        }
        catch (err)
        { 
            console.log("ERROR: Navbar")
        }
        finally
        {

        }

    }, [loggingInName, loggingInPassword, newUserName, newUserPassword])

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

    function startSignUp()
    {
        localStorage.setItem("LoggedInUser", JSON.stringify(null));
        setUser(null);

        setIsSigningUp(true);

        setIsLoggingIn(false);
        setLoggingInName(null);
        setLoggingInPassword(null);

    }

    async function attemptSignUp()
    {
        var copyName = false;

        await get(ref(db, "Users")).then((snapshot) => {
            snapshot.forEach(n =>
            {
                if(n.val().name === newUserName)
                {
                    copyName = true;
                }
            }) 
        })

        if(copyName === false)
        {
            await get(ref(db, "UserID")).then((snapshot) => {
                set(ref(db, "UserID"), snapshot.val() + 1);
                set(ref(db, "Users/" + newUserName), {userID: snapshot.val(), name: newUserName, password: newUserPassword, admin: false});
                localStorage.setItem("LoggedInUser", JSON.stringify({userID: snapshot.val(), name: newUserName, password: newUserPassword, admin: false}));
            })
            window.location.reload(false);
        } 
    }

    function closeSignUp()
    {
        setIsSigningUp(false);
        setNewUserName("");
        setNewUserPassword("");
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
                {user === null?
                    <div/>
                :
                    user.admin === false?
                        <div className = "navbarName"> {user.name} </div>
                    :
                        <div className = "navbarName"> {user.name} (Admin) </div>
                }
                <div className = "navbarNavigation">
                    <NavLink className = "navbarLink" to = {{pathname: "/home", props: {test: "Hello"}}} >Home</NavLink>
                    <NavLink className = "navbarLink" to = "/about">About Me</NavLink>
                    <NavLink className = "navbarLink" to = "/commission">Commissions</NavLink>
                    {
                        user === null ?
                            <div className = "loginHeader">
                                <button className = "logoutButtonB" onClick = {openLoggingIn}>Login</button>
                            </div>
                        :
                            <div className = "loginHeader">
                                <button className = "logoutButtonB" onClick = {logOut}>Log out</button>
                            </div>
                    }
                </div>
            </div>

            <Modal style={addModalStyle} isOpen = {isLoggingIn} onRequestClose = {closeLoggingIn} ariaHideApp={false}>
                <div>
                    <h1 className = "loginTitle">Login</h1>
                    <div><input placeholder = "name..." onChange = {(event) => {(setLoggingInName(event.target.value))}}/></div>
                    <div><input placeholder = "password..." onChange = {(event) => {(setLoggingInPassword(event.target.value))}}/></div>
                    <div><button onClick = {attemptLogin} disabled = {loggingInValid}>Submit</button></div>

                    <div className = "navbarSignUpLink">
                        <div> Don't have an account? </div>
                        <button onClick = {startSignUp}> sign up </button>
                    </div>
                </div>
            </Modal>

            <Modal style={addModalStyle} isOpen = {isSigningUp} onRequestClose = {closeSignUp} ariaHideApp={false}>
                <div>
                    <h1 className = "loginTitle">Sign Up</h1>
                    <div><input placeholder = "name..." onChange = {(event) => {(setNewUserName(event.target.value))}}/></div>
                    <div><input placeholder = "password..." onChange = {(event) => {(setNewUserPassword(event.target.value))}}/></div>
                    <div><button onClick = {attemptSignUp} disabled = {signUpValid}>Submit</button></div>
                </div>
            </Modal>
        </div>
    )
}

export default Navbar;