import React, {useEffect} from "react";
import "../css/Footer.css";

function Footer() {

    useEffect(() => {


    }, [])

    return (
        <div className = "footerMainDiv">
            <a className = "footerLink" href="https://twitter.com/KagaKittyCreate">
                <img className = "footerLinkImage" src = {require("../Images/Twitter.png")}/>
            </a>
            <a className = "footerLink" href="https://www.instagram.com/_kagakitty_/">
                <img className = "footerLinkImage" src = {require("../Images/Instagram.png")}/>
            </a>
        </div>
    )
}

export default Footer;