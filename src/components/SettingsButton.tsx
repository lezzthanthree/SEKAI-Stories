import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import SupportButton from "./SupportButton";
import { Checkbox } from "./UI/Checkbox";
import { SceneContext } from "../contexts/SceneContext";
import { SettingsContext } from "../contexts/SettingsContext";
import Window from "./UI/Window";
import { handleChangeLanguage, languageNames } from "../utils/i18ninit";
import { SoftErrorContext } from "../contexts/SoftErrorContext";
import packageJson from "../../package.json";
import Translators from "./Translators";

const SettingsButton: React.FC = () => {
    const month = new Date().getMonth() * -1 + 1;
    const [triggerWarning, showTriggerWarning] = useState<boolean>(false);
    const { t, i18n } = useTranslation();
    const lng = i18n.language;
    const [show, setShow] = useState<boolean>(false);

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);

    if (!scene || !settings || !softError) {
        throw new Error("Context not provided.");
    }

    const { guideline, setGuideline } = scene;
    const {
        openAll,
        setOpenAll,
        showExperimental,
        setShowExperimental,
        showSaveDialog,
        setShowSaveDialog,
        blankCanvas,
        setBlankCanvas,
        setShowTutorial,
        audio,
        setAudio,
    } = settings;
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

    const handleGuideline = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (guideline) {
            guideline.container.visible = value;
            setGuideline({
                ...guideline,
                visible: value,
            });
        }
    };

    const handleExperimental = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (
            value &&
            !confirm(
                "This is only used for testing and other experimental features. Continue?"
            )
        ) {
            return;
        }
        localStorage.setItem("showExperimental", String(value));
        setShowExperimental(value);
    };

    const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("openAll", String(value));
        setOpenAll(value);
    };
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
    const handleBlankCanvasOctober = (value: boolean) => {
        localStorage.setItem("blankCanvasOctober", String(value));
        setBlankCanvas(value);
    };

    return (
        <>
            <div id="settings">
                <button
                    className="btn-circle btn-white"
                    onClick={() => {
                        setShow(true);
                    }}
                >
                    <i className="bi bi-gear-fill sidebar__select"></i>
                </button>
            </div>
            {show && (
                <Window show={setShow}>
                    <div className="window__content">
                        <SupportButton />
                        <h1>{t("settings.header")}</h1>
                        <div className="window__divider">
                            <h2>{t("settings.language")}</h2>
                            <select
                                name="language"
                                id="language"
                                value={lng}
                                onChange={handleChangeLanguage}
                            >
                                {Object.entries(languageNames).map(
                                    ([code, name]) => (
                                        <option key={code} value={code}>
                                            {name}
                                        </option>
                                    )
                                )}
                            </select>
                            <Translators lng={lng} />
                            <a
                                href="https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README-localization.md"
                                target="_blank"
                            >
                                Contribute for translation!
                            </a>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.auto-save")}</h2>
                            <p>{t("settings.auto-save-description")}</p>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={handleGetAutoSaveData}
                            >
                                {t("settings.auto-save-button")}
                            </button>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.tutorial")}</h2>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={() => {
                                    setShowTutorial(true);
                                    setShow(false);
                                }}
                            >
                                {t("settings.show-tutorial")}
                            </button>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.toggles")}</h2>
                            <Checkbox
                                id="audio"
                                label={t("settings.audio")}
                                checked={audio}
                                onChange={handleAudio}
                            />
                            <Checkbox
                                id="saveDialog"
                                label={t("settings.saveDialog")}
                                checked={showSaveDialog}
                                onChange={handleSaveDialog}
                            />
                            <Checkbox
                                id="blankCanvas"
                                label={t("settings.blankCanvas")}
                                checked={blankCanvas}
                                onChange={
                                    month === 10
                                        ? (e) => {
                                              const value = e.target.checked;
                                              if (value) {
                                                  handleBlankCanvasOctober(
                                                      value
                                                  );
                                                  return;
                                              }
                                              showTriggerWarning(true);
                                          }
                                        : handleBlankCanvas
                                }
                            />
                            <Checkbox
                                id="expand"
                                label={t("settings.expand")}
                                checked={openAll}
                                onChange={handleExpand}
                            />
                            <Checkbox
                                id="guideline"
                                label={t("settings.guidelines")}
                                checked={guideline?.visible}
                                onChange={handleGuideline}
                            />
                            <Checkbox
                                id="experimental"
                                label={t("settings.experimental")}
                                checked={showExperimental}
                                onChange={handleExperimental}
                            />
                        </div>
                        <div className="window__divider center">
                            <p>{"v" + packageJson.version}</p>
                        </div>
                    </div>
                </Window>
            )}
            {triggerWarning && (
                <Window
                    show={showTriggerWarning}
                    confirmFunction={() => {
                        handleBlankCanvasOctober(false);
                    }}
                    confirmLabel="Disable"
                >
                    <div className="window__content">
                        <div className="window__divider">
                            <h1>Trigger Warning</h1>
                            <p>Happy Spooky Season!</p>
                            <p>Blank canvas is enabled by default.</p>
                            <p>
                                By disabling this, you will receive random
                                scenes that may include VOCALOID and other song
                                references containing sensitive topics.
                            </p>
                            <p>Do you wish to continue?</p>
                        </div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default SettingsButton;
