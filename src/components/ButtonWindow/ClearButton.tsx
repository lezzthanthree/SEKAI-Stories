import React, { useContext, useState } from "react";
import Window from "../UI/Window";
import { Checkbox } from "../UI/Checkbox";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SceneContext } from "../../contexts/SceneContext";

const SelfAwareEntity: React.FC = () => {
    throw new Error("A self aware entity has been found.");
    return <></>;
};

const ClearButton: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!scene || !settings) throw new Error("Context not found");

    const [resetShow, setResetShow] = useState(false);
    const { reset, setReset } = scene;
    const { blankCanvas, setBlankCanvas, deleting, setDeleting } = settings;
    const [crash, setCrash] = useState(false);

    const handleBlankCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("blankCanvas", String(value));
        setBlankCanvas(value);
    };

    if (crash) {
        return <SelfAwareEntity />;
    }

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
                    confirmFunction={() => {
                        if (deleting) {
                            setCrash(true);
                            setDeleting(false);
                            return;
                        }
                        setReset(reset + 1);
                    }}
                    confirmLabel={t("global.clear-ok")}
                    danger={true}
                >
                    {deleting ? (
                        <div className="window__content">
                            <div className="window__divider flex-vertical">
                                <h1>System Error</h1>
                                <p>
                                    A system error has occurred while deleting
                                    the recent canvas. The only way to fix this
                                    is by refreshing your browser.
                                </p>
                                <p className=" margin-top-10">
                                    Any data from the recent canvas will be
                                    lost. Do you wish to continue?
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="window__content">
                            <div className="window__divider center">
                                <h3 className="text-center">
                                    {t("clear.message")}
                                </h3>
                            </div>
                            <div className="windown__divider center">
                                <Checkbox
                                    id="stop-show"
                                    label={t("clear.start-blank")}
                                    checked={blankCanvas}
                                    onChange={handleBlankCanvas}
                                />
                            </div>
                        </div>
                    )}
                </Window>
            )}
        </>
    );
};

export default ClearButton;
