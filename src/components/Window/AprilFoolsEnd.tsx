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

    const { setReset, reset } = scene;
    const { setSkippedFools } = settings;
    const handleSkip = () => {
        localStorage.setItem("skippedFools", "true");
        localStorage.setItem("sawWindow", "true");
        setSkippedFools(true);
        setReset(reset + 1);
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
                            Skip
                        </button>
                    </>
                }
            >
                <div className="window__content">
                    <div className="window__divider center">
                        <h1 className="text-center">Happy April Fools!</h1>
                    </div>
                    <div className="window__divider">
                        <p>
                            As April Fools comes to an end, you can skip the
                            entire sequence right here try the "Just Mizuki"
                            special event!
                        </p>
                        <p>
                            You can always skip the entire sequence at anytime
                            by typing "skip" into    the Name Tag or into      the Dialogue
                            Box.
                        </p>
                    </div>
                </div>
            </Window>
        </>
    );
};

export default AprilFoolsEnd;
