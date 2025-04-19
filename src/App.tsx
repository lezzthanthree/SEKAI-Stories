import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";

function App() {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(240); // Adjusted for quicker testing
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide } = context;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsVisible(false);
        }
    }, [timeLeft]);

    const timerStyle: React.CSSProperties = {
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "black",
    };

    const messageStyle: React.CSSProperties = {
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold",
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: "90%",
        display: "block", // To prevent extra space below the image
        margin: "10px auto", // Center the image horizontally
    };

    return (
        <main>
            {!isVisible && (
                <div style={messageStyle}>
                    Thanks for testing my application! Please provide your
                    feedback and experiences by scanning the QR Code below!
                    <br />
                    <img src="/img/Sekai_Stories2.png" style={imageStyle} />
                </div>
            )}
            {isVisible && (
                <>
                    <div style={timerStyle}>
                        {Math.floor(timeLeft / 60)}:
                        {String(timeLeft % 60).padStart(2, "0")}
                    </div>
                    <Content />
                    {!hide && <Sidebar />}
                </>
            )}
        </main>
    );
}

export default App;
