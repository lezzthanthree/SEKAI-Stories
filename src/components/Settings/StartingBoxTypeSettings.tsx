import React, { useContext } from "react";
import SettingsGroup from "../UI/SettingsGroup";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";

const TogglesSettings: React.FC = () => {
    const { t } = useTranslation();
    const settings = useContext(SettingsContext);

    if (!settings) {
        throw new Error("Context not provided.");
    }
    const { startingBoxType, setStartingBoxType } = settings;

    const handleBoxType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        localStorage.setItem("startingBoxType", value);
        setStartingBoxType(value as "default" | "classic");
    };

    return (
        <SettingsGroup header={t("settings.starting-box-type")}>
            <p>{t("settings.starting-box-type-description")}</p>

            <select
                name="box-type"
                id="box-type"
                value={startingBoxType}
                onChange={handleBoxType}
            >
                <option value="default">
                    {t("text.dialogue.box-type.default")}
                </option>
                <option value="classic">
                    {t("text.dialogue.box-type.classic")}
                </option>
            </select>
        </SettingsGroup>
    );
};

export default TogglesSettings;
