import React, {useEffect, useState} from "react";
import {db} from "../../firebase-config"
import { ref, set, onValue } from "firebase/database";
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";


import "../css/Commission.css";

function Commission () {

    const [user, setUser] = useState(null);

    const [commissionList, setCommissionList] = useState([]);
    const [commissionNum, setCommissionNum] = useState(0);

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
    }, [])

    async function submitCommission()
    {
        console.log("Submit");
        try
        {
            var tempID = 0;
            await onValue(ref(db, "CommissionID"), snapshot =>
            {
                tempID = snapshot.val();
            })

            //const baseImage = await convertBase64(addNewImage)
            //await addDoc(artCollection, {name: addNewName, image: baseImage, description: addNewDescription})
            //console.log("Start");
            //setUploading(true);
            //await setDoc(doc(db, "ArtCards", addNewName), {name: addNewName, image: baseImage, description: addNewDescription});
            await set(ref(db, "Commissions/" + tempID), {ID: tempID, test: ("yes: " + tempID)});
        }
        catch(err)
        {
            console.log("ERROR: " + err);
        }
        finally
        {
            set(ref(db, "CommissionID"), tempID + 1);
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