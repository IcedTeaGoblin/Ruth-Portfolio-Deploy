import React, {useEffect, useState} from "react";

import "../css/ArtCard.css";

function ArtCard(prop) {

    const [tempValue, setTempValue] = useState(0);

    useEffect(() => {

    }, [tempValue])

    return (
        <div> 
            <button style = {{backgroundColor: "transparent", borderWidth: "0px"}} onClick = {() => prop.viewFunction(prop.card)}>
                <img className = "artCardImage" src = {prop.image}/>
            </button>
        </div>
    )
}

export default ArtCard;