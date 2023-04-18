import React, {useEffect, useState} from "react";
import { Grid } from '@material-ui/core';
import {db} from "../../firebase-config"
import Modal from "react-modal";
import { ref, set, onValue, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

 
import ArtCard from "./ArtCard.jsx";

import "../css/Home.css";

function Home () {
    const [artCards, setArtCards] = useState([]);

    const [isAddingArt, setAddingArt] = useState(false)
    const [addNewName, setAddNewName] = useState("");
    const [addNewImage, setAddNewImage] = useState(null);
    const [addNewDescription, setAddNewDescription] = useState("");

    const [isViewingArt, setViewingArt] = useState(false);
    const [viewingImage, setViewingImage] = useState(null);

    const [addingArtValid, setAddingArtValid] = useState(true);

    const [user, setUser] = useState(null);

    const [temp, setTemp] = useState(0);

    const [uploading, setUploading] = useState(false);

    const [artNum, setArtNum] = useState(0);

    localStorage.setItem("isLoading", false);

    const navigate = useNavigate();

    useEffect(() => {

        if(addNewName === "" || addNewImage === null || addNewDescription === "")
        {
            setAddingArtValid(true);
        }
        else
        {
            setAddingArtValid(false);
        }

        onValue(ref(db, "ArtCards"), snapshot =>
        {
            var tempArt = [];
            var tempI = 0;
            snapshot.forEach(n =>
            {
                tempArt.push(n.val());
                tempI++;
            })
            setArtCards(tempArt);
            setArtNum(tempI);
        })

        //Retrieve active user using local storage
        if(localStorage.getItem("LoggedInUser") !== null)
        {
            get(ref(db, "Users/" + JSON.parse(localStorage.getItem("LoggedInUser")))).then(snapshot =>
            {
                setUser(snapshot.val());
            })
        }
        //getArt();
    }, [addNewName, addNewImage, isAddingArt, addNewDescription, temp])


    async function submitNewArt() 
    {
        try 
        {
            const baseImage = await convertBase64(addNewImage)
            //await addDoc(artCollection, {name: addNewName, image: baseImage, description: addNewDescription})
            console.log("Start");
            setUploading(true);
            //await setDoc(doc(db, "ArtCards", addNewName), {name: addNewName, image: baseImage, description: addNewDescription});
            set(ref(db, "ArtCards/" + addNewName), {name: addNewName, image: baseImage, description: addNewDescription});
            
        }
        catch(err)
        {
            console.error("writeToDB failed. reason :", err);
        }
        finally
        {
            //const data = await getDocs(artCollection);
            //setArtCards(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
            setUploading(false);
            setAddingArt(false);
            console.log("Done");
            setAddNewName("");
            setAddNewImage(null);
            setAddNewDescription("");
        }
    }

    function openAddingArt() 
    {
        setAddingArt(true);
    }

    function closeAddingArt() 
    {
        setAddingArt(false);
        setAddNewName("");
        setAddNewImage(null);
        setAddNewDescription("");
    }

    function openViewingArt(obj) 
    {
        /*
        console.log(obj);
        setViewingImage(obj);
        setViewingArt(true);
        */

        console.log("Start");
        navigate(`view/${obj.name}`);
        console.log("Done");
    }

    function closeViewingArt() 
    {
        setViewingArt(false);
        setViewingImage(null);
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
        <div>
            {localStorage.getItem("isLoading") === true ? 
                    null 
                : 
                    <div>                 
                        <div className = "HomeDisplay">
                            { user === null || user.admin === false ?
                                <div className = "homeContentTitle">
                                    <div>Artwork ({artNum})</div>
                                </div>
                            :
                                <div className = "homeContentTitle">
                                    <div>Artwork ({artNum})</div>
                                    <button className = "homeContentAddButton" style = {{backgroundColor: "transparent", borderWidth: "0px"}} onClick = {openAddingArt}>
                                        <img className = "homeContentAdd" src = {require("../Images/Add.png")} alt = "Add new art"/>
                                    </button>
                                </div>
                            }
                            
                            <Grid container spacing = {6} alignItems="center">
                                {artCards.map((currCard, index) => {
                                    return (
                                        <Grid item xs = {12} sm = {6} md = {4} lg = {3} xl = {2} key = {index}>
                                            <ArtCard 
                                                name = {currCard.name} 
                                                image = {currCard.image}
                                                id = {currCard.id}
                                                viewFunction = {openViewingArt}
                                                card = {currCard}
                                                resetFunction = {setTemp}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>

                        {/*Modal for adding art*/}
                        <Modal className = "modalAdd" isOpen = {isAddingArt} onRequestClose = {closeAddingArt} ariaHideApp={false}>
                            {uploading === true ?
                                <div>
                                    <div>Uploading...</div>
                                    <div className="loadingSpinner"/>
                                </div>
                                :
                                <div className = "addNewImage">
                                    <input className = "addNewImageName" placeholder = "*name..." onChange = {(event) => {(setAddNewName(event.target.value))}}/>
                                    <textarea className = "addNewImageDesc" id = "noResize" placeholder = "description..." onChange = {(event) => {(setAddNewDescription(event.target.value))}}/>
                                    <input type="file" multiple = {false} accept = ".png, .jpg" onChange = {(event) => {(setAddNewImage(event.target.files[0]))}}/>
                                    {
                                    addNewImage == null ? 
                                        null
                                    :
                                        <div>
                                            <div><img className = "addNewImageDisplay" src = {URL.createObjectURL(addNewImage)} alt="Preview of art being added"/></div>
                                            <div><button onClick = {submitNewArt} disabled = {addingArtValid}>Submit</button></div>
                                        </div>
                                    }
                                    <div><button onClick = {closeAddingArt}>Cancel</button></div>
                                </div>
                                }
                        </Modal>

                        {/*Modal for viewing full images and information*/}
                        {
                            viewingImage === null ?
                                null
                            :
                            <Modal className = "modalView" isOpen = {isViewingArt} onRequestClose = {closeViewingArt} ariaHideApp={false}>
                                <div className = "viewImage">
                                    <div className = "viewImagePicP">
                                        <img className = "viewImagePic" src = {viewingImage.image} alt="Full size version of art piece being shown"/>
                                    </div>
                                    <pre className = "viewImageName">{viewingImage.name}</pre>
                                    <pre className = "viewImageDescription">{viewingImage.description}</pre>
                                    <button onClick = {closeViewingArt} className = "viewImageClose">Close</button>
                                </div>
                            </Modal>
                        }
                    </div>
            }   
        </div>
    )
}
///<img className = "footer" src = {require("../Images/Footer.jpg")} alt="Footer for the website"/>
export default Home;