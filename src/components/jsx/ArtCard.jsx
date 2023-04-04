import { requirePropFactory } from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {db} from "../../firebase-config"
import base64 from 'base-64'

import "../css/ArtCard.css";
import TempImage from "../Images/TempImage.jpg";
import { getDatabase, ref, set, onValue, remove, removeValue, doc } from "firebase/database";

function ArtCard(prop) {

    const [newName, setNewName] = useState("")

    const [user, setUser] = useState(null);

    const [tempValue, setTempValue] = useState(0);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
    }, [tempValue])

    const changeName = async() => {
        const newFields = {name: newName};

        setNewName("");
    }

    const deleteArtCard = async() => {
        set(ref(db, "ArtCards/" + prop.name), null);
        //window.location.reload(false);
        prop.resetFunction(Math.random());
    }

    return (
        <div className = "CardParent"> 
            {/*Card title*/}
            <h1 className = "cardNameDisplay">{prop.name}</h1> 

            <button className = "cardHolder" style = {{backgroundColor: "transparent", borderWidth: "0px"}} onClick = {() => prop.viewFunction(prop.card)}>
                <img className = "CardImage" src = {prop.image}/>
            </button>

            <div className = "optionDisplay">
                {/*Card delete button, only visible if a user is currently logged in*/}
                {
                user === null ?
                    null
                :
                <button onClick = {deleteArtCard} style = {{backgroundColor: "transparent", borderWidth: "0px"}}>
                    <img src = {require("../Images/Trash.png")} style = {{height: "50px", width: "50px", backgroundColor: "transparent"}}/>
                </button>
                }  
            </div>
        </div>
    )
}

export default ArtCard;