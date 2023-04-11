import React, {useEffect, useState} from "react";
import {db} from "../../firebase-config"
import { ref, set, onValue } from "firebase/database";
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";


import "../css/Commission.css";

function Commission () {

    const [user, setUser] = useState(null);

    const [viewArt, setViewArt] = useState(null);
    const prop = useParams();

    const navigate = useNavigate();

    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
    }, [])

    return (
        <div className = "commissionContentDiv">
            Commissions
        </div>
    )
}
///<img className = "footer" src = {require("../Images/Footer.jpg")} alt="Footer for the website"/>
export default Commission;