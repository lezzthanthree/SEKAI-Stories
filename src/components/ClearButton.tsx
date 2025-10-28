import React, { useContext, useState } from "react";
import Window from "./UI/Window";
import { Checkbox } from "./UI/Checkbox";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../contexts/SettingsContext";
import { SceneContext } from "../contexts/SceneContext";

const ClearButton: React.FC = () => {
    const month = new Date().getMonth() * -1 + 1;
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!scene || !settings) throw new Error("Context not found");

    const [resetShow, setResetShow] = useState(false);
    const { reset, setReset } = scene;
    const { blankCanvas, setBlankCanvas } = settings;

    const handleBlankCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("blankCanvas", String(value));
        setBlankCanvas(value);
    };
    return (
        <>
            <div id="clear">
                <button
                    className="btn-circle btn-white"
                    onClick={() => setResetShow(true)}
                >
                    <i className="bi bi-trash-fill sidebar__select"></i>
                </button>
            </div>
            {resetShow && (
                <Window
                    show={setResetShow}
                    confirmFunction={() => setReset(reset + 1)}
                    confirmLabel={t("clear-ok")}
                    danger={true}
                >
                    <div className="window__content">
                        <div className="window__divider center">
                            <h3 className="text-center">{t("clear")}</h3>
                        </div>
                        <div className="windown__divider center">
                            {month === 10 ? (
                                <p>
                                    You can change the option for blank canvas
                                    on Settings.
                                </p>
                            ) : (
                                <Checkbox
                                    id="stop-show"
                                    label={t("start-blank")}
                                    checked={blankCanvas}
                                    onChange={handleBlankCanvas}
                                />
                            )}
                        </div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default ClearButton;
