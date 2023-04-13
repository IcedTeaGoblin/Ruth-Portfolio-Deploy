import React, {useEffect, useState} from "react";
import {db} from "../../firebase-config"
import { ref, set, onValue, get } from "firebase/database";
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";


import "../css/Commission.css";

function Commission () {

    const [user, setUser] = useState(null);

    const [commissionList, setCommissionList] = useState([]);
    const [commissionNum, setCommissionNum] = useState(0);

    const [newCommissionDesc, setCommissionDesc] = useState("");
    const [newCommissionImage, setCommissionImage] = useState(null);

    useEffect(() => {

        onValue(ref(db, "Commissions"), snapshot =>
        {
            var tempCom = [];
            var tempI = 0;
            snapshot.forEach(n =>
            {
                tempCom.push(n.val());
                tempI++;
            })
            setCommissionList(tempCom);
            setCommissionNum(tempI);
        })

        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
    }, [newCommissionDesc])

    async function submitCommission()
    {
        console.log("Submit");
        try
        {
            await get(ref(db, "CommissionID")).then((snapshot) =>
            {
                set(ref(db, "CommissionID"), snapshot.val() + 1);
                set(ref(db, "Commissions/" + snapshot.val()), {ID: snapshot.val(), test: ("yes: " + snapshot.val())});
            })

            //const baseImage = await convertBase64(addNewImage)
            //await addDoc(artCollection, {name: addNewName, image: baseImage, description: addNewDescription})
            //console.log("Start");
            //setUploading(true);
            //await setDoc(doc(db, "ArtCards", addNewName), {name: addNewName, image: baseImage, description: addNewDescription});
        }
        catch(err)
        {
            console.log("ERROR: " + err);
        }
    }

    return (
        <div className = "commissionContentDiv">
            <div className = "commissionTitle">Commissions</div>
            {
                user === null?
                    <div className = "commissionAccessDenied">Please log in or create an account to request a commission</div>
                :
                user.admin === false?
                    <div>Not admin</div>
                :
                    <div>Admin</div>
            }
            <button onClick = {submitCommission}>Submit</button>
        </div>
    )
}
///<img className = "footer" src = {require("../Images/Footer.jpg")} alt="Footer for the website"/>
export default Commission;