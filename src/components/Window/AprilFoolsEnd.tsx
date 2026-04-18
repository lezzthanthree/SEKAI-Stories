import React, { Dispatch, SetStateAction, useContext } from "react";
import Window from "../UI/Window";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SceneContext } from "../../contexts/SceneContext";

interface AprilFoolsEndProps {
    show: Dispatch<SetStateAction<boolean>>;
}

const AprilFoolsEnd: React.FC<AprilFoolsEndProps> = ({ show }) => {
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!settings || !scene) throw new Error("Context not found");

    const handleSkip = () => {
        window.location.href = "https://sekai-stories.pages.dev";
        show(false);
    };

    return (
        <>
            <Window
                show={show}
                hideClose={true}
                className="window__90_width"
                confirmFunction={() => {
                    localStorage.setItem("sawWindow", "true");
                }}
                confirmLabel="See event"
                buttons={
                    <>
                        <button
                            className="btn-regular btn-white center"
                            onClick={handleSkip}
                        >
                            Go back
                        </button>
                    </>
                }
            >
                <div className="window__content">
                    <div className="window__divider center">
                        <h1 className="text-center">Hey there!</h1>
                    </div>
                    <div className="window__divider">
                        <p>
                            This page was made for April Fools 2026! It is
                            archived here for you to see and experience if you
                            missed it.
                        </p>
                        <p>
                            If you want to experience the event, simply click
                            "See event".
                        </p>
                        <p>
                            If you want to skip the event, click "Go back" and
                            you will be redirected to the main website.
                        </p>
                        <p>
                            You can click the Settings button if you wish to go
                            out.
                        </p>
                        <p>This event has ended on April 7th, 00:00 JST.</p>
                    </div>
                </div>
            </Window>
        </>
    );
};

export default AprilFoolsEnd;
