import React, { useState, useEffect } from 'react';

const CountDown = ({ hoursMinsSecs }) => {
    const { hours = 0, minutes = 0, seconds = 0 } = hoursMinsSecs;
    const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
    localStorage.setItem("seconds", secs)
    localStorage.setItem("minutes", mins)
    localStorage.setItem("hours", hrs)
    
    const tick = () => {
        const secs = parseInt(localStorage.getItem("seconds"))
        const mins = parseInt(localStorage.getItem("minutes"))
        const hrs = parseInt(localStorage.getItem("hours"))
        
        if(hrs === 0 && mins === 0 && secs === 0) 
            reset()
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
        } else {
            setTime([hrs, mins, secs - 1]);
        }
    };

    const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

    useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });

    return (
        <div>
            <p>
                {`${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`}
            </p>
        </div>
    );
}

export default CountDown;