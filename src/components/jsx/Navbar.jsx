import React, {useEffect, useState} from "react";
import "../css/Navbar.css";
import {db} from "../../firebase-config"
import Modal from "react-modal";
import { ref, onValue, set, get } from "firebase/database";
import { NavLink} from "react-router-dom";


function Navbar() {

    const [user, setUser] = useState([]);

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [loggingInEmail, setLoggingInEmail] = useState("");
    const [loggingInPassword, setLoggingInPassword] = useState("");

    const [loggingInValid, setLoggingInValid] = useState(true);

    const [isSigningUp, setIsSigningUp] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");

    const [signUpValid, setSignUpValid] = useState(true);

    const [emailCopy, setEmailCopy] = useState(false);

    useEffect(async() => {

        setEmailCopy(false);
        console.log(emailCopy)
        setLoggingInValid(loggingInEmail === "" || loggingInPassword === "");
        setSignUpValid(newUserEmail === "" || newUserPassword === "" || emailVal() === false);
        try
        {
            setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
        }
        catch (err)
        { 
            console.log("ERROR: Navbar")
        }
        finally
        {

        }

    }, [loggingInEmail, loggingInPassword, newUserEmail, newUserName, newUserPassword])

    function emailVal()
    {
        const check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(check.test(newUserEmail) === false)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    function openLoggingIn()
    {
        setIsLoggingIn(true);
    }

    
    function closeLoggingIn()
    {
        setIsLoggingIn(false);
        setLoggingInEmail("");
        setLoggingInPassword("");
    }

    function attemptLogin()
    {
        onValue(ref(db, "Users"), snapshot =>
        {
            snapshot.forEach(n =>
            {
                if(n.val().email === loggingInEmail && n.val().password === loggingInPassword)
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
        setLoggingInEmail("");
        setLoggingInPassword("");

    }

    async function checkEmailCopy()
    {
        let result = await get(ref(db, "Users")).then((snapshot) => {
            return snapshot.forEach(n =>
            {
                if(n.val().email === newUserEmail)
                {
                    console.log("YES");
                    return true;
                }
            })
        })

        if(result === true) {return true}
        else {return false}
    }

    async function attemptSignUp()
    {    
        //Wait for the results of whether the email is a copy, then...
        checkEmailCopy().then(result => {
            ///If the email is not a copy...
            if(result === false)
            {
                //Find the current userID value
                get(ref(db, "UserID")).then((snapshot) => {
                    //Itterate the userID value but one, and then...
                    set(ref(db, "UserID"), snapshot.val() + 1);
                    //Add the new user to the User database...
                    set(ref(db, "Users/" + snapshot.val()), {userID: snapshot.val(), email: newUserEmail, name: newUserName, password: newUserPassword, admin: false, activeCommission: false});
                    //And set the current logged-in user to the newly registered account
                    localStorage.setItem("LoggedInUser", JSON.stringify({userID: snapshot.val(), email: newUserEmail, name: newUserName, password: newUserPassword, admin: false, activeCommission: false}));
                }).then(i => {
                    //And refresh the page to finalize procedures
                    window.location.reload(false);
                })
            }
            else if(result == true)
            {
                setEmailCopy(true);
            }
        })
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
                    <div><input placeholder = "email..." onChange = {(event) => {(setLoggingInEmail(event.target.value))}}/></div>
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
                    <div><input className = "navbarSignUpInput" placeholder = "email..." onChange = {(event) => {(setNewUserEmail(event.target.value))}}/></div>
                    {emailVal() === true?
                        emailCopy === false?
                            null
                        :
                            <div className = "navbarSignUpEmailWarning">Email is already in use!</div>
                    :
                        <div className = "navbarSignUpEmailWarning">Please use a valid email address</div>
                    }
                    <div><input className = "navbarSignUpInput" placeholder = "name..." onChange = {(event) => {(setNewUserName(event.target.value))}}/></div>
                    <div><input className = "navbarSignUpInput" placeholder = "password..." onChange = {(event) => {(setNewUserPassword(event.target.value))}}/></div>
                    <div><button className = "navbarSignUpSubmit" onClick = {attemptSignUp} disabled = {signUpValid}>Submit</button></div>
                </div>
            </Modal>
        </div>
    )
}

export default Navbar;