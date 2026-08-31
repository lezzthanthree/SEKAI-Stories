import React from "react";
import SettingsGroup from "../UI/SettingsGroup";
import { useTranslation } from "react-i18next";
import { handleChangeLanguage, languageNames } from "../../utils/i18ninit";
import Translators from "../UI/Translators";

const LanguageSettings: React.FC = () => {
    const { t, i18n } = useTranslation();
    const lng = i18n.language;

    return (
        <SettingsGroup header={t("settings.language")}>
            <select
                name="language"
                id="language"
                value={lng}
                onChange={handleChangeLanguage}
            >
                {Object.entries(languageNames).map(([code, name]) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>
            <Translators lng={lng} />
            <a
                href="https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README-localization.md"
                target="_blank"
            >
                Contribute for translation!
            </a>
        </SettingsGroup>
    );
};

export default LanguageSettings;
