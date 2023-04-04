import React, {useEffect} from "react";
import "../css/Header.css";
import Logo from "../Images/Logo.png";

function Header() {

    useEffect(() => {


    }, [])

    return (
        <div className = "headerDiv">
            <img className = "headerLogo" src = {Logo} alt="Website logo"/>
            <div className = "headerTitle">Ruth's Portfolio Website</div>
        </div>
    )
}

export default Header;