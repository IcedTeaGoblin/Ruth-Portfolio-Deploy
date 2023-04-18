import React, {useEffect, useState} from "react";

import "../css/CommissionCard.css";

function CommissionCard(prop) {

    const [tempValue, setTempValue] = useState(0);

    useEffect(() => {

    }, [tempValue])

    return (
        <div className = "commissionCardDiv"> 
            <div className = "commissionCardTitle"> 
                <div className = "commissionCardTitleText">{prop.submittedUserName}</div>
                <div className = "commissionCardTitleText">{prop.dateSubmitted}</div>
            </div>
            <pre className = "commissionCardDesc">{prop.desc}</pre>
            <div className = "commissionCardContact"> Preferred contact: {prop.contact}</div>
        </div>
    )
}

export default CommissionCard;