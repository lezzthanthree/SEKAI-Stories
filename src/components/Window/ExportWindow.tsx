import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../contexts/SceneContext";
import { ValidateJsonSave } from "../../utils/ValidateJsonSave";
import Window from "../UI/Window";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { loadScene } from "../../utils/LoadExportedScene";

interface ExportWindowProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExportWindow: React.FC<ExportWindowProps> = ({ setShow }) => {
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [importedFile, setImportedFile] = useState<File>();
    const [unsavedWindow, setUnsavedWindow] = useState<boolean>(false);
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);

    const { t } = useTranslation();

    if (!scene || !settings || !softError)
        throw new Error("Context not prepared.");

    const { models, sceneJson, reset, setReset, setSceneJson } = scene;
    const { setUnsaved, setLoading, unsaved } = settings;
    const { setErrorInformation } = softError;

    const handleExport = () => {
        const modelCount = Object.values(models || {}).filter((model) => {
            if (
                model.from == "upload" ||
                model.from == "kisaragi" ||
                model.from == "roleplay" ||
                model.character == "none" ||
                model.character == "custom"
            )
                return false;
            return true;
        });

        if (modelCount.length <= 0) {
            setErrorInformation(t("error.no-valid-models"));
            return;
        }
        const jsonString = JSON.stringify(sceneJson, null, 2);
        const blob = new Blob([jsonString], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.sekaiscene";
        a.click();
        a.remove();

        setUnsaved(false);
    };

    const handleImport = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json, .sekaiscene";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            setImportedFile(file);
            if (unsaved) {
                setUnsavedWindow(true);
                return;
            }
            startImport(file);
        };
        input.click();
        input.remove();
    };

    const startImport = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const jsonString = event.target?.result;
            if (typeof jsonString === "string") {
                try {
                    const data = JSON.parse(jsonString);
                    if (ValidateJsonSave(data)) {
                        await loadScene(
                            data,
                            setLoading,
                            setLoadingMsg,
                            setErrorInformation,
                            scene,
                        );
                        setSceneJson(data);
                        setUnsaved(false);
                    } else {
                        setErrorInformation(t("error.invalid-json"));
                        return;
                    }
                } catch (error) {
                    setErrorInformation(
                        `${String(error)}\n${t("error.import-scene-fail")}`,
                    );
                    console.error("Error loading scene:", error);
                    setReset(reset + 1);
                    setLoading(100);
                    setLoadingMsg("");
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <Window
                id="export-screen"
                show={setShow}
                buttons={
                    <>
                        <button
                            className="btn-regular btn-blue center"
                            onClick={handleImport}
                            disabled={loadingMsg !== ""}
                        >
                            {t("global.import")}
                        </button>
                        <button
                            className="btn-regular btn-blue center"
                            onClick={handleExport}
                            disabled={loadingMsg !== ""}
                        >
                            {t("global.export")}
                        </button>
                    </>
                }
            >
                <div className="window__content">
                    <h1>{t("import-export.header")}</h1>
                    <p>{t("import-export.description")}</p>
                    {loadingMsg && <p>{loadingMsg}</p>}
                    <textarea
                        name="json"
                        id="json"
                        value={sceneJson && JSON.stringify(sceneJson, null, 2)}
                        readOnly
                    />
                </div>
            </Window>
            {unsavedWindow && (
                <Window
                    show={setUnsavedWindow}
                    confirmFunction={() => {
                        startImport(importedFile!);
                    }}
                    confirmLabel={t("global.continue-ok")}
                    closeLabel={t("global.cancel")}
                    danger
                >
                    <div className="window__content">
                        <div className="window__divider center">
                            <h3 className="text-center">
                                You have unsaved changes to your story.
                                Do you wish to continue?
                            </h3>
                        </div>
                        <div className="windown__divider center"></div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default ExportWindow;
