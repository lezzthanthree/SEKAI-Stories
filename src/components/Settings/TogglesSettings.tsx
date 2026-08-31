import React, { useContext } from "react";
import SettingsGroup from "../UI/SettingsGroup";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";
import { Checkbox } from "../UI/Checkbox";

const StartingBoxTypeSettings: React.FC = () => {
    const { t } = useTranslation();
    const settings = useContext(SettingsContext);

    if (!settings) {
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
        audio,
        setAudio,
    } = settings;

    const mentalHealthCookie =
        localStorage.getItem("mentalHealthWordFound") === "true";

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
        <SettingsGroup header={t("global.toggles")}>
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
        </SettingsGroup>
    );
};

export default StartingBoxTypeSettings;
