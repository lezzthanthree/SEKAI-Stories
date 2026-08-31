import { useContext, useEffect } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import Window from "./Window";
import { useTranslation } from "react-i18next";

export function ErrorFallback({ error }: { error: Error }) {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    if (!scene || !settings) throw new Error("Context not prepared.");
    const { sceneJson } = scene;
    const { setUnsaved, showExperimental } = settings;

    useEffect(() => {
        localStorage.setItem("autoSave", JSON.stringify(sceneJson));
    }, [sceneJson]);

    setUnsaved(true);

    const handleAutoSaveData = () => {
        const data = localStorage.getItem("autoSave");
        if (!data) {
            alert("No auto-save data found.");
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
    const message = `
        System Information:
        User Agent: ${navigator.userAgent}
        Platform: ${navigator.platform}

        Traceback:
        ${error.stack}

        Message:
        ${error.message}
    `
        .trim()
        .replace(/^ {8}/gm, "");

    return (
        <div className="app-en center flex-vertical full-screen padding-20">
            <Window
                show={() => {}}
                id="error-screen"
                buttons={
                    <>
                        <button
                            className="btn-red btn-regular"
                            onClick={handleAutoSaveData}
                        >
                            {t("error-boundary.save-data-button")}
                        </button>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(message);
                                alert(t("error-boundary.copied-to-clipboard"));
                                window.open(
                                    "https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README.md#report-an-issue",
                                    "_blank",
                                );
                            }}
                            className="btn-regular btn-blue"
                        >
                            {t("error-boundary.report-issue-button")}
                        </button>
                    </>
                }
                hideClose={true}
            >
                <div className="window__content">
                    <div className="window__divider center">
                        <img src="/img/gomen.png" id="error-img" />
                    </div>
                    <h2 className="text-center">「。。。ごめん。。。」</h2>
                    <p className="text-center">
                        {t("error-boundary.unexpected")}
                    </p>

                    {showExperimental ? (
                        <p className="text-center">
                            Did you forget a variable?
                        </p>
                    ) : (
                        <>
                            <p className="text-center">
                                {t("error-boundary.inconvenience")}
                            </p>
                            <p className="text-center">
                                {t("error-boundary.clear-cookies")}
                            </p>
                            <p className="text-center">
                                {t("error-boundary.report-issue")}
                            </p>
                            <p className="text-center">
                                {t("error-boundary.automatic-save")}
                            </p>
                            <p
                                className="text-center link"
                                onClick={handleAutoSaveData}
                            >
                                {t("error-boundary.save-data")}
                            </p>
                        </>
                    )}
                    <textarea
                        readOnly
                        value={message}
                        id="error-traceback"
                    ></textarea>
                </div>
            </Window>
        </div>
    );
}
