import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Window from "../UI/Window";

interface FortniteProps {
    show: Dispatch<SetStateAction<boolean>>;
}

const Fortnite: React.FC<FortniteProps> = ({ show }) => {
    useEffect(() => {
        localStorage.setItem("gotFortnited", "true");
    }, []);

    const [count, setCount] = useState(0);
    return (
        <>
            {count == 0 && (
                <Window
                    show={show}
                    confirmFunction={() => {
                        setCount(1);
                    }}
                    hideClose={true}
                    className="window__90_width"
                    skipCloseInConfirm
                >
                    <div className="window__content">
                        <div className="window__divider center">
                            <h3 className="text-center">
                                This application is not available for minors.
                            </h3>
                        </div>
                    </div>
                </Window>
            )}
            {count == 1 && (
                <Window
                    show={show}
                    hideClose={true}
                    confirmFunction={() => {}}
                    className="window__90_width"
                >
                    <div className="window__content">
                        <h3 className="text-center">
                            <video autoPlay controls={false} loop>
                                <source src="/video/mizuki_default.mp4" />
                            </video>
                        </h3>
                        <div className="window__divider center flex-vertical">
                            <p>this window only shows 3%</p>
                            <p>you just single pulled a 4★ equivalent</p>
                        </div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default Fortnite;
