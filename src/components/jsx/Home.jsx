import React, {useEffect, useState} from "react";
import { Grid } from '@material-ui/core';
import {db} from "../../firebase-config"
import Modal from "react-modal";
import { ref, set, onValue } from "firebase/database";

 
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

    localStorage.setItem("isLoading", false);

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
            snapshot.forEach(n =>
            {
                tempArt.push(n.val());
            })
            setArtCards(tempArt);
        })

        setUser(JSON.parse(localStorage.getItem("LoggedInUser")));
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
        console.log(obj);
        setViewingImage(obj);
        setViewingArt(true);
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
        <div style ={{backgroundColor: "#f8cde1"}}>
            {localStorage.getItem("isLoading") === true ? 
                    null 
                : 
                    <div>
                        <div className = "addArtCard">
                            {
                                user === null ?
                                    null
                                :
                                    <button className = "addButton" onClick = {openAddingArt}>
                                        <img src = {require("../Images/Add.png")} alt= "Button to add a new piece of art" style = {{height: "50px", width: "50px"}}/>
                                    </button>
                            }
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



                        <div className = "HomeDisplay">
                            <Grid container spacing = {3}>
                                {artCards.map((currCard, index) => {
                                    return (
                                        <Grid item xs = {12} sm = {6} md = {4} lg = {3}>
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
                    </div>
            }   
        </div>
    )
}
///<img className = "footer" src = {require("../Images/Footer.jpg")} alt="Footer for the website"/>
export default Home;