import i18n from "i18next";
import en from "../locale/en-US.json";
import pl from "../locale/pl-PL.json";
import zh from "../locale/zh-CN.json";
import es from "../locale/es-ES.json";
import fil from "../locale/fil-PH.json";
import ms from '../locale/ms-MY.json';
import th from '../locale/th-TH.json';

export const languageNames = {
    en: "English",
    es: "Español",
    zh: "简体中文",
    fil: "Filipino",
    ms: "Bahasa Melayu",
    pl: "Polski (incomplete)",
    th: "ไทย",
};

export const handleChangeLanguage = async (
    event: React.ChangeEvent<HTMLSelectElement>
) => {
    const languangeToChange = event.target.value;

    i18n.changeLanguage(languangeToChange);
    localStorage.setItem("language", languangeToChange);
};

const i18nInit = () => {
    i18n.init({
        interpolation: { escapeValue: false },
        lng: "en",
        resources: {
            en: { translation: en },
            pl: { translation: pl },
            zh: { translation: zh },
            es: { translation: es },
            fil: { translation: fil },
            ms: { translation: ms },
            th: { translation: th },
        },
        fallbackLng: "en",
    });

    const language = localStorage.getItem("language");
    i18n.changeLanguage(language ? language : "en");
};

export default i18nInit;
