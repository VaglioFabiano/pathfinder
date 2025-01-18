import { FaRegQuestionCircle } from "react-icons/fa";
import { useState } from 'react';



const Tutorial = ({mod}) =>{
    const [isClicked, setIsClicked] = useState(false);
    const startTutorial = () =>{
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);    
    }
    return (
        <div
            style={{
              position: "absolute",
              bottom: mod === 'add' ? "500px" : "150px", // Cambia posizione dinamicamente
              right: "20px",
              zIndex: 1000,
            }}
            >
          <button
            className={`tutorial-button ${isClicked ? 'clicked' : ''}`}
            onClick={startTutorial}
          >
            <FaRegQuestionCircle  className="nav-icon"  />
          </button>
        </div>
      );
}

export default Tutorial