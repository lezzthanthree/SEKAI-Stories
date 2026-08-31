import React, { useContext } from "react";
import SettingsGroup from "../UI/SettingsGroup";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";

interface TutorialSettingsProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const TutorialSettings: React.FC<TutorialSettingsProps> = ({ setShow }) => {
    const { t } = useTranslation();
    const settings = useContext(SettingsContext);

    if (!settings) {
        throw new Error("Context not provided.");
    }
    const { setShowTutorial } = settings;

    return (
        <SettingsGroup header={t("settings.tutorial")}>
            <button
                className="btn-blue btn-extend-width btn-regular"
                onClick={() => {
                    setShowTutorial(true);
                    setShow(false);
                }}
            >
                {t("settings.show-tutorial")}
            </button>
        </SettingsGroup>
    );
};

export default TutorialSettings;
