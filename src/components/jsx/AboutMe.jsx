import React, {useEffect, useState} from "react";
import { Grid } from '@material-ui/core';
import {db} from "../../firebase-config"
import Modal from "react-modal";
import { ref, set, onValue } from "firebase/database";

import "../css/AboutMe.css";

function AboutMe () {

    const [user, setUser] = useState(null);
    const [aboutMeText, setAboutMeText] = useState("");

    const [isLoadingEdit, setIsLoadingEdit] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editingBody, setEditingBody] = useState("");
    
    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
        if(user != null)
        {
            console.log("ABOUT ME: " + user.name);
        }

        onValue(ref(db, "AboutMe"), snapshot =>
        {
            setAboutMeText(snapshot.val());
        })
    }, [isEditing, editingBody])

    function startEdit()
    {
        setEditingBody(aboutMeText);

        setIsEditing(true);
    }

    function cancelEdit()
    {
        setIsEditing(false);
        setEditingBody("");
    }

    async function finishEdit()
    {
        try 
        {
            setIsLoadingEdit(true);
            await set(ref(db, "AboutMe"), editingBody);
        }
        catch(err)
        {

        }
        finally 
        {
            setEditingBody("");
            setIsEditing(false);
            setIsLoadingEdit(false);
        }
    }

    async function checkUserExists()
    {
        var tempUser = await JSON.parse(localStorage.getItem("LoggedInUser"));
        onValue(ref(db, "Users"), snapshot =>
        {
            snapshot.forEach(n =>
            {
                if(n.val().name === tempUser.name && n.val().password === tempUser.password)
                {
                    localStorage.setItem("LoggedInUser", JSON.stringify(n.val()));
                    window.location.reload(false);
                }
            })
        })
    }

    return (
        <div>
            <Modal className = "modalEditAbout" isOpen = {isEditing} onRequestClose = {cancelEdit} ariaHideApp={false}>
                     {isLoadingEdit === true ?
                        null
                    :
                        <div className = "editContent">
                            <textarea defaultValue = {aboutMeText} id = "noResize" cols = {160} rows = {40} placeholder = "description..." onChange = {(event) => {(setEditingBody(event.target.value))}}/>
                            <button onClick = {finishEdit}>Submit</button>
                        </div>
                    }
            </Modal>

            {user === null || user.admin === false ? 
                <div className = "mainAboutDiv">
                    <div className = "title">About Me:</div>
                    <pre className = "body" style={{ flex: 1, textAlign: "left" }}>{aboutMeText}</pre>
                </div> 
            :
                <div className = "mainAboutDiv">
                    <div className = "titleEditDiv">
                        <div className = "title">About Me:</div>
                        <button className = "editContentButton" onClick = {startEdit} style = {{backgroundColor: "transparent", borderWidth: "0px"}}>
                            <img className = "editContentButtonImage" src = {require("../Images/Edit.png")}/>
                        </button>
                    </div>
                    <div className = "bodyParent">
                        <pre className = "body">{aboutMeText}</pre>
                    </div>
                </div> 
            }
        </div>
    )
}

export default AboutMe;