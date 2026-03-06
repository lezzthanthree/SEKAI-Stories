import { useContext, useEffect } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import Window from "./Window";

export function ErrorFallback({ error }: { error: Error }) {
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    if (!scene || !settings) throw new Error("Context not prepared.");
    const { sceneJson } = scene;
    const { setAllowRefresh, showExperimental, deleted, skippedFools } =
        settings;

    useEffect(() => {
        localStorage.setItem("autoSave", JSON.stringify(sceneJson));
    }, [sceneJson]);

    setAllowRefresh(true);

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
                            Save Data
                        </button>
                        <button
                            className="btn-blue btn-regular"
                            onClick={() => {
                                navigator.clipboard.writeText(message);
                                alert("Copied to clipboard!");
                            }}
                        >
                            Copy Traceback
                        </button>
                        <button
                            onClick={() =>
                                window.open(
                                    "https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README.md#report-an-issue",
                                    "_blank",
                                )
                            }
                            className="btn-regular btn-pink"
                        >
                            Report Issue
                        </button>
                    </>
                }
                hideClose={true}
            >
                <div className="window__content">
                    <div className="window__divider center">
                        <img
                            src="/img/gomen.png"
                            id="error-img"
                            className={deleted && !skippedFools ? "tear" : ""}
                        />
                    </div>
                    <h2 className="text-center">「。。。ごめん。。。」</h2>
                    <p className="text-center">
                        An unexpected error has occurred.
                    </p>

                    {showExperimental ? (
                        <p className="text-center">
                            Did you somehow forget a variable?
                        </p>
                    ) : deleted && !skippedFools ? (
                        <>
                            <p className="text-center">
                                We're really sorry for the inconvenience.
                            </p>
                            <p className="text-center">
                                Please refresh the page and try again.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-center">
                                We're really sorry for the inconvenience.
                            </p>
                            <p className="text-center">
                                Please clear the cookies, refresh the page, and
                                try again.
                            </p>
                            <p className="text-center">
                                If the problem persists, please report this
                                issue on GitHub.
                            </p>
                            <p className="text-center">
                                Your work is automatically saved.
                            </p>
                            <p
                                className="text-center link"
                                onClick={handleAutoSaveData}
                            >
                                Save it as soon as possible.
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
