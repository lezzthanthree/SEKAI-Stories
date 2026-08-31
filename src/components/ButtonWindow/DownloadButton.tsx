import React, { useContext, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import * as PIXI from "pixi.js";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import DownloadWindow from "../Window/DownloadWindow";

const DownloadButton: React.FC = () => {
    const [saveWindowShow, setSaveWindowShow] = useState(false);
    const [saveData, setSaveData] = useState<string>("");

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);

    if (!scene || !settings || !error) {
        return;
    }

    const { app, guideline, setGuideline, sceneJson } = scene;
    const { setAllowRefresh, showSaveDialog, setLoading } = settings;
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
        } catch (err) {
            if (err instanceof Error) {
                setErrorInformation(
                    `An error has occurred while trying to save your scene.\nError: ${err.message}\nIf this error persists, please report this on GitHub.`,
                );
                setLoading(100);
            }
        }
    };

    return (
        <>
            <div id="download">
                <button className="btn-circle btn-blue" onClick={handleSave}>
                    <i className="bi bi-camera-fill sidebar__select"></i>
                </button>
            </div>
            {saveWindowShow && (
                <DownloadWindow
                    setShow={setSaveWindowShow}
                    saveData={saveData}
                />
            )}
        </>
    );
};

export default DownloadButton;
