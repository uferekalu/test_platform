import React, { useState, useEffect } from 'react';

const CountDown = ({ hoursMinsSecs }) => {
    const { hours = localStorage.getItem("hours"), minutes = localStorage.getItem("minutes"), seconds = localStorage.getItem("seconds") } = hoursMinsSecs;
    const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
    // console.lp
    localStorage.setItem("seconds", secs)
    localStorage.setItem("minutes", mins)
    localStorage.setItem("hours", hrs)
    
    const tick = () => {
        const secs = localStorage.getItem("seconds") && localStorage.getItem("seconds") !== "NaN" ? parseInt(localStorage.getItem("seconds")): 0
        const mins = localStorage.getItem("minutes") && localStorage.getItem("minutes") !== "NaN" ? parseInt(localStorage.getItem("minutes")): 0
        const hrs = localStorage.getItem("hours") && localStorage.getItem("hours") !== "NaN" ? parseInt(localStorage.getItem("hours")): 0
        
        if(hrs === 0 && mins === 0 && secs === 0){
            reset()
            localStorage.setItem("seconds", "30")
            localStorage.setItem("minutes", "0")
            localStorage.setItem("hours", "0")
            document.getElementById('nexQuestion').click();        
        } 
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
            localStorage.setItem("hours", hrs - 1)
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
            localStorage.setItem("minutes", mins - 1)
        } else {
            setTime([hrs, mins, secs - 1]);
            localStorage.setItem("seconds", secs - 1)
        }    
    };

    const reset = () => setTime(["0", "0", "30"]);

    useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => {
            clearInterval(timerId);
        }
    });

    return (
        <div>
            <p>
                {`${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`} <div id="countDown" onClick={reset}/>
            </p>
        </div>
    );
}

export default CountDown;