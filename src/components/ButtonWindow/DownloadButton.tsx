import React, { useContext, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import * as PIXI from "pixi.js";
import { useTranslation } from "react-i18next";
import Window from "../UI/Window";
import { SettingsContext } from "../../contexts/SettingsContext";
import { Checkbox } from "../UI/Checkbox";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";

const DownloadButton: React.FC = () => {
    const [saveWindowShow, setSaveWindowShow] = useState(false);
    const [saveData, setSaveData] = useState<string>("");
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);

    if (!scene || !settings || !error) {
        return;
    }

    const { app, guideline, setGuideline, sceneJson } = scene;
    const {
        setAllowRefresh,
        showSaveDialog,
        setShowSaveDialog,
        setLoading,
        deleted,
        skippedFools,
    } = settings;
    const { setErrorInformation } = error;

    const handleSave = async () => {
        try {
            setLoading(0);
            if (guideline) {
                guideline.container.visible = false;
                setGuideline({
                    ...guideline,
                    visible: false,
                });
            }
            const region = new PIXI.Rectangle(0, 0, 1920, 1080);
            const texture = app?.renderer.generateTexture(app.stage, {
                region,
            });
            setLoading(50);
            const dataURL = await app?.renderer.extract
                .image(texture)
                .then((img: HTMLImageElement) => img.src);
            setSaveData(dataURL!);

            if (showSaveDialog) setSaveWindowShow(true);

            const date = new Date().toISOString().replace(/[:.]/g, "-");

            const a = document.createElement("a");
            a.href = dataURL!;
            a.download = `canvas_${date}.png`;
            document.body.append(a);
            a.click();
            a.remove();

            setLoading(100);
            localStorage.setItem("autoSave", JSON.stringify(sceneJson));
            setAllowRefresh(true);
            if (!deleted && !skippedFools) {
                setErrorInformation("Ain't I the cutest? ♡");
            }
        } catch (err) {
            if (err instanceof Error) {
                setErrorInformation(
                    `An error has occurred while trying to save your scene.\nError: ${err.message}\nIf this error persists, please report this on GitHub.`,
                );
                setLoading(100);
            }
        }
    };

    const handleSaveDialog = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("saveDialog", String(!value));
        setShowSaveDialog(!value);
    };

    return (
        <>
            <div id="download">
                <button className="btn-circle btn-blue" onClick={handleSave}>
                    <i className="bi bi-camera-fill sidebar__select"></i>
                </button>
            </div>
            {saveWindowShow && (
                <Window show={setSaveWindowShow}>
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
            )}
        </>
    );
};

export default DownloadButton;
