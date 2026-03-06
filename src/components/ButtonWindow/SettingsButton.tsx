import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SupportButton from "./SupportButton";
import { Checkbox } from "../UI/Checkbox";
import { SceneContext } from "../../contexts/SceneContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import Window from "../UI/Window";
import { handleChangeLanguage, languageNames } from "../../utils/i18ninit";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import packageJson from "../../../package.json";
import Translators from "../UI/Translators";

const SettingsButton: React.FC = () => {
    const { t, i18n } = useTranslation();
    const lng = i18n.language;
    const [show, setShow] = useState<boolean>(false);

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
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

    if (!scene || !settings || !softError) {
        throw new Error("Context not provided.");
    }

    const {
        openAll,
        setOpenAll,
        showMentalHealthWindow,
        setShowMentalHealthWindow,
        showSaveDialog,
        setShowSaveDialog,
        showAnnouncements,
        setShowAnnouncements,
        blankCanvas,
        setBlankCanvas,
        setShowTutorial,
        audio,
        setAudio,
        deleted,
        skippedFools,
    } = settings;
    const { setErrorInformation } = softError;
    const mentalHealthCookie =
        localStorage.getItem("mentalHealthWordFound") === "true";

    const handleGetAutoSaveData = () => {
        const data = localStorage.getItem("autoSave");
        if (!data) {
            setErrorInformation(t("error.no-autosave"));
            return;
        }
        const jsonParsed = JSON.parse(data);
        const jsonString = JSON.stringify(jsonParsed, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "autoSave.sekaiscene";
        a.click();
        a.remove();
    };

    const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("audio", String(value));
        setAudio(value);
    };
    const handleSaveDialog = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("saveDialog", String(value));
        setShowSaveDialog(value);
    };
    const handleBlankCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("blankCanvas", String(value));
        setBlankCanvas(value);
    };
    const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("openAll", String(value));
        setOpenAll(value);
    };
    const handleMentalHealthWindow = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.checked;
        localStorage.setItem("mentalHealthWindow", String(value));
        setShowMentalHealthWindow(value);
    };
    const handleAnnouncement = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setShowAnnouncements(value);
    };

    return (
        <>
            <div id="settings">
                <button
                    className="btn-circle btn-white"
                    onClick={() => {
                        if (!deleted && !skippedFools) {
                            setErrorInformation(
                                "You don't need the settings anymore. You'll stay here forever and ever... ♡",
                            );
                            return;
                        }
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
                        {deleted && !skippedFools && (
                            <div className="window__divider">
                                <h2>Restore</h2>
                                <p>
                                    A system crash has been recently found.
                                    During memory dump, 1 file has reported
                                    missing.
                                </p>
                                <p>
                                    If you wish to restore the missing files,
                                    please consider calling their name.
                                </p>
                            </div>
                        )}
                        <div className="window__divider">
                            <h2>{t("settings.language")}</h2>
                            <select
                                name="language"
                                id="language"
                                value={lng}
                                onChange={handleChangeLanguage}
                            >
                                {Object.entries(languageNames).map(
                                    ([code, name]) => (
                                        <option key={code} value={code}>
                                            {name}
                                        </option>
                                    ),
                                )}
                            </select>
                            <Translators lng={lng} />
                            <a
                                href="https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README-localization.md"
                                target="_blank"
                            >
                                Contribute for translation!
                            </a>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.auto-save")}</h2>
                            <p>{t("settings.auto-save-description")}</p>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={handleGetAutoSaveData}
                            >
                                {t("settings.auto-save-button")}
                            </button>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.tutorial")}</h2>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={() => {
                                    setShowTutorial(true);
                                    setShow(false);
                                }}
                            >
                                {t("settings.show-tutorial")}
                            </button>
                        </div>
                        <div className="window__divider">
                            <h2>{t("global.toggles")}</h2>
                            <Checkbox
                                id="audio"
                                label={t("settings.audio")}
                                checked={audio}
                                onChange={handleAudio}
                            />
                            <Checkbox
                                id="saveDialog"
                                label={t("settings.save-dialog")}
                                checked={showSaveDialog}
                                onChange={handleSaveDialog}
                            />
                            <Checkbox
                                id="blankCanvas"
                                label={t("settings.blank-canvas")}
                                checked={blankCanvas}
                                onChange={handleBlankCanvas}
                            />
                            <Checkbox
                                id="expand"
                                label={t("settings.expand")}
                                checked={openAll}
                                onChange={handleExpand}
                            />
                            {mentalHealthCookie && (
                                <Checkbox
                                    id="mentalHealth"
                                    label={t("settings.mental-health-window")}
                                    checked={showMentalHealthWindow}
                                    onChange={handleMentalHealthWindow}
                                />
                            )}
                            <Checkbox
                                id="announcement"
                                label={t("settings.announcement")}
                                checked={showAnnouncements}
                                onChange={handleAnnouncement}
                            />
                        </div>
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
