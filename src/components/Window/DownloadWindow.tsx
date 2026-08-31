import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Window from "../UI/Window";
import { SettingsContext } from "../../contexts/SettingsContext";
import { Checkbox } from "../UI/Checkbox";

interface DownloadWindowProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    saveData: string;
}

const DownloadWindow: React.FC<DownloadWindowProps> = ({
    setShow,
    saveData,
}) => {
    const { t } = useTranslation();

    const settings = useContext(SettingsContext);

    if (!settings) {
        return;
    }

    const { showSaveDialog, setShowSaveDialog } = settings;

    const handleSaveDialog = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("saveDialog", String(!value));
        setShowSaveDialog(!value);
    };

    return (
        <Window show={setShow}>
            <div className="window__content">
                <div className="window__divider">
                    <h1>{t("save.header")}</h1>
                    <p>
                        {window.matchMedia("(pointer: fine)").matches
                            ? t("save.note-1-desktop")
                            : t("save.note-1-phone")}
                    </p>
                    <p>{t("save.note-2")}</p>
                    <img src={saveData} className="width-100" />
                </div>
                <div className="windown__divider center">
                    <Checkbox
                        id="stop-show"
                        label={t("save.disable-dialog")}
                        checked={!showSaveDialog}
                        onChange={handleSaveDialog}
                    />
                </div>
            </div>
        </Window>
    );
};

export default DownloadWindow;
