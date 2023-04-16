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
    const [newCommissionContact, setCommissionContact] = useState("");

    const [commissionValid, setCommissionValid] = useState(false);

    useEffect(() => {

        setCommissionValid(newCommissionDesc === "");

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
    }, [newCommissionDesc, newCommissionImage, newCommissionContact])

    //Function that submits a new commission to the Commissions database
    async function submitCommission()
    {
        var baseImage = null
        if(newCommissionImage !== null)
        {
            baseImage = await convertBase64(newCommissionImage);
        }
        //Retrieve the current commissionID value and then...
        get(ref(db, "CommissionID")).then(snapshot =>
        {
                //Itterate the commissionID value
                set(ref(db, "CommissionID"), snapshot.val() + 1);
                //Push the new commission request to the Commission database
                if(newCommissionContact === "")
                {
                    set(ref(db, "Commissions/" + snapshot.val()), {ID: snapshot.val(), desc: newCommissionDesc, img: baseImage, contact: user.email});
                }
                else
                {
                    set(ref(db, "Commissions/" + snapshot.val()), {ID: snapshot.val(), desc: newCommissionDesc, img: baseImage, contact: newCommissionContact});
                }
        }).then(i => {console.log("Submitted!")});
    }

    function convertBase64(file)
    {
        try
        {
            return new Promise((resolve, reject) => {
                const tempFileReader = new FileReader();
                //console.log(file);
                tempFileReader.readAsDataURL(file);
    
                tempFileReader.onload = () => {
                    resolve(tempFileReader.result);
                }
    
                tempFileReader.onerror = (error) => {
                    reject(error);
                };
            });
        }
        catch(err)
        {

        }
    };

    return (
        <div className = "commissionContentDiv">
            <div className = "commissionTitle">Commissions</div>
            {
                user === null?
                    <div className = "commissionAccessDenied">Please log in or create an account to request a commission</div>
                :
                user.admin === false?
                    <div className = "addCommission">
                        <div className = "commissionAccessDenied">Submit a commission request</div>
                        <div className = "commissionInput">
                            <div className = "commissionInputTitle">Description of commission request</div>
                            <textarea className = "commissionInputTextArea" id = "noResize" placeholder = "*describe your commission request..." onChange = {(event) => {(setCommissionDesc(event.target.value))}}/>
                        </div>
                        <div className = "commissionImageInput">
                        <div className = "commissionInputTitle">Reference image (not required)</div>
                            <input type="file" multiple = {false} accept = ".png, .jpg" onChange = {(event) => {(setCommissionImage(event.target.files[0]))}}/>
                        </div>
                        <div className = "commissionContactInput">
                            <div className = "commissionInputTitle">Preferred contact (account email by default)</div>
                            <input className = "commissionContactInputText" placeholder = {user.email} onChange = {(event) => {(setCommissionContact(event.target.value))}}/>
                        </div>
                        <button onClick = {submitCommission} disabled = {commissionValid}>Submit</button>
                    </div>
                :
                    <div>Admin</div>
            }
        </div>
    )
}
///<img className = "footer" src = {require("../Images/Footer.jpg")} alt="Footer for the website"/>
export default Commission;