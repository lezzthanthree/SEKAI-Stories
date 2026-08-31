import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SupportButton from "./SupportButton";
import Window from "../UI/Window";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import packageJson from "../../../package.json";
import LanguageSettings from "../Settings/LanguageSettings";
import StartingBoxTypeSettings from "../Settings/StartingBoxTypeSettings";
import TutorialSettings from "../Settings/TutorialSettings";
import AutosaveSettings from "../Settings/AutosaveSettings";
import TogglesSettings from "../Settings/TogglesSettings";

const SettingsButton: React.FC = () => {
    const { t } = useTranslation();
    const [show, setShow] = useState<boolean>(false);

    const softError = useContext(SoftErrorContext);
    const [stillAlive, setStillAlive] = useState<number>(0);

    useEffect(() => {
        if (stillAlive < 39) return;
        setErrorInformation(
            "The cake is a lie.\n(miku radio edit by: digiral)",
        );
        if (stillAlive == 39) {
            const radio = new Audio("/sound/85.2-miku.wav");
            radio.loop = true;
            radio.play();
        }
    }, [stillAlive]);

    if (!softError) {
        throw new Error("Context not provided.");
    }

    const { setErrorInformation } = softError;

    return (
        <>
            <div id="settings">
                <button
                    className="btn-circle btn-white"
                    onClick={() => {
                        setShow(true);
                    }}
                >
                    <i className="bi bi-gear-fill sidebar__select"></i>
                </button>
            </div>
            {show && (
                <Window show={setShow}>
                    <div className="window__content">
                        <SupportButton />
                        <h1>{t("settings.header")}</h1>
                        <LanguageSettings />
                        <StartingBoxTypeSettings />
                        <AutosaveSettings />
                        <TutorialSettings setShow={setShow} />
                        <TogglesSettings />
                        <div
                            className="window__divider center flex flex-vertical"
                            onClick={() => {
                                setStillAlive(stillAlive + 1);
                            }}
                        >
                            <p>{"v" + packageJson.version}</p>
                            {stillAlive > 5 && stillAlive < 39 && (
                                <p>{39 - stillAlive} more...</p>
                            )}
                        </div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default SettingsButton;
