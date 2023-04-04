import React, {useEffect, useState} from "react";
import {db} from "../../firebase-config"
import { ref, set, onValue } from "firebase/database";
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";


import "../css/ViewArt.css";

function ViewArt (props) {

    const [user, setUser] = useState(null);

    const [viewArt, setViewArt] = useState(null);
    const prop = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        onValue(ref(db, "ArtCards"), snapshot =>
        {
            snapshot.forEach(n =>
            {
                if(n.val().name === prop.artName)
                {
                    setViewArt(n.val());
                }
            })
        })
        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
    }, [])

    async function removeArt()
    {
        try
        {
            await set(ref(db, "ArtCards/" + viewArt.name), null);
            prop.resetFunction(Math.random());
        }
        catch(err)
        {

        }
        finally
        {
            navigate("/home");
        }
    }


    return (
        <div>
            { viewArt === null?
                    <div>?</div>
                :
                    <div className = "viewContentDiv">
                        {user === null?
                            <div className = "viewContentTitle">{viewArt.name}</div>
                        :
                            <div className = "viewContentTitle">
                                <div>{viewArt.name}</div>
                                <button className = "viewContentDelete" onClick = {removeArt} style = {{backgroundColor: "transparent", borderWidth: "0px"}}>
                                    <img className = "viewContentDeleteImage" src = {require("../Images/Remove.png")} alt = "Delete image"/>
                                </button>
                            </div>
                        }
                        <img className = "viewContentImage" src = {viewArt.image} alt = {viewArt.name}/>
                        <pre className = "viewContentDesc">{viewArt.description}</pre>
                    </div>

            }
        </div>
    )
}
///<img className = "footer" src = {require("../Images/Footer.jpg")} alt="Footer for the website"/>
export default ViewArt;