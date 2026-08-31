import React, { useContext } from "react";
import Window from "../UI/Window";
import { Checkbox } from "../UI/Checkbox";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SceneContext } from "../../contexts/SceneContext";

interface ClearWindowProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClearWindow: React.FC<ClearWindowProps> = ({ setShow }) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!scene || !settings) throw new Error("Context not found");

    const { reset, setReset } = scene;
    const { blankCanvas, setBlankCanvas } = settings;

    const handleBlankCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("blankCanvas", String(value));
        setBlankCanvas(value);
    };
    return (
        <Window
            show={setShow}
            confirmFunction={() => setReset(reset + 1)}
            confirmLabel={t("global.clear-ok")}
            closeLabel={t("global.cancel")}
            danger={true}
        >
            <div className="window__content">
                <div className="window__divider center">
                    <h3 className="text-center">{t("clear.message")}</h3>
                </div>
                <div className="windown__divider center">
                    {
                        <Checkbox
                            id="stop-show"
                            label={t("clear.start-blank")}
                            checked={blankCanvas}
                            onChange={handleBlankCanvas}
                        />
                    }
                </div>
            </div>
        </Window>
    );
};

export default ClearWindow;
