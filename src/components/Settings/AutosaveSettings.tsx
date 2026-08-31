import React, { useContext } from "react";
import SettingsGroup from "../UI/SettingsGroup";
import { useTranslation } from "react-i18next";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";

const AutosaveSettings: React.FC = () => {
    const { t } = useTranslation();
    const softError = useContext(SoftErrorContext);

    if (!softError) {
        throw new Error("Context not provided.");
    }

    const { setErrorInformation } = softError;

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
    return (
        <SettingsGroup header={t("settings.auto-save")}>
            <p>{t("settings.auto-save-description")}</p>
            <button
                className="btn-blue btn-extend-width btn-regular"
                onClick={handleGetAutoSaveData}
            >
                {t("settings.auto-save-button")}
            </button>
        </SettingsGroup>
    );
};

export default AutosaveSettings;
