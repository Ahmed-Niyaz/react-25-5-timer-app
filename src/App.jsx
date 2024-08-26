import { useEffect } from "react";
import { useState } from "react"

export default function App() {
  
  const [isActive, setIsActive] = useState(false);
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timeType, setTimeType] = useState('SESSION');
  
  
  const formattedTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
  }
  
  const toggleBreak = (type) => {
    if (type === 'inc') {
      if (breakTime < 60) {
        setBreakTime(prev => prev + 1);
      } else {
        return;
      }
    } else {
      if (breakTime > 1) {
        setBreakTime(prev => prev - 1);
      } else{
        return;
      }
    }
  }
  
  const toggleSession = (type) => {
    if (type === 'inc') {
      if (sessionTime < 60) {
        setSessionTime(prev => prev + 1);
        setTimeLeft((sessionTime + 1) * 60)
      } else {
        return;
      }
    } else {
      if (sessionTime > 1) {
        setSessionTime(prev => prev - 1);
        setTimeLeft((sessionTime - 1) * 60)
      } else{
        return;
      }
    }
  }
  
  const handlePlayPause = () => {
    setIsActive(prev => !prev);
  }
  
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(1500);
    setBreakTime(5);
    setSessionTime(25);
    setTimeType('SESSION')
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  }
  
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev > 0) {
            return prev - 1;
          } else {
            return 0;
          }
        })
      }, 1000)
    } else {
      return;
    }
    
    
    return () => { clearInterval(interval); console.log('return of clearInterval') }
  }, [isActive]);
  
  useEffect(() => {
    let timeOut = null;
    if (timeLeft === 0) {
      const audio = document.getElementById('beep');
      audio.play();
      timeOut = setTimeout(() => {
        if (timeType === 'SESSION') {
          setTimeLeft(breakTime * 60);
          setTimeType('BREAK');
        } else{
          setTimeLeft(sessionTime * 60);
          setTimeType('SESSION')
        }
      }, 1000 )
      
    }
    
    return () => clearTimeout(timeOut);
  }, [timeLeft])
  
  // const breakIncrement = () => {
  //   if (breakTime < 60) {
  //     setBreakTime(prev => prev + 1);
  //   }
  // }
  
  // const breakDecrement = () => {
  //   if (breakTime > 1) {
  //     setBreakTime(prev => prev - 1);
  //   }
  // }
  
  return (
    <div className="container">
      <div className="main-title">25 + 5 Clock</div>
      <div className="controllers">

        <div className="control-length">
          <div id="session-label" className="control-text">Session Length</div>
          <div className="control-btns">
            <button onClick={() => toggleSession('dec')} disabled={isActive} id="session-decrement"><i className="fa fa-arrow-down"></i></button>
            <div id="session-length">{ sessionTime }</div>
            <button onClick={() => toggleSession('inc')} disabled={isActive} id="session-increment"><i className="fa fa-arrow-up"></i></button>
          </div>
        </div>
        
        <div className="control-length">
          <div id="break-label" className="control-text">Break Length</div>
          <div className="control-btns">
            <button onClick={() => toggleBreak('dec')} disabled={isActive} id="break-decrement"><i className="fa fa-arrow-down"></i></button>
            <div id="break-length">{ breakTime }</div>
            <button onClick={() => toggleBreak('inc')} disabled={isActive} id="break-increment"><i className="fa fa-arrow-up"></i></button>
          </div>
        </div>
        
      </div>
      
      <div className="control-display">
        
        <div className="timer-display" style={{color: timeLeft < 60 ? "red" : "white"}}>
          <div id="timer-label">{ timeType === 'BREAK' ? 'Break' : 'Session' }</div>
          <div id="time-left">{formattedTime()}</div>
        </div>
        
        <div className="timer-control" >
          <button onClick={handleReset} id="reset"><i className="fa fa-refresh"></i></button>
          <button onClick={handlePlayPause} id="start_stop"><i className={ isActive ? "fa fa-pause" : "fa fa-play"} style={{ color: isActive ? "white" : "yellow" }}></i></button>
        </div>
        <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
      </div>
    </div>
  )
}