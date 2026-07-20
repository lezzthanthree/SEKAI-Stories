import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../contexts/SceneContext";
import { IJsonSave } from "../../types/IJsonSave";
import { ValidateJsonSave } from "../../utils/ValidateJsonSave";
import Window from "../UI/Window";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { loadScene } from "../../utils/LoadExportedScene";

const ExportButton: React.FC = () => {
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);
    const [validModelCount, setValidModelCount] = useState<number>(0);

    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);
    if (!scene || !settings || !softError)
        throw new Error("Context not prepared.");

    const {
        background,
        splitBackground,
        lighting,
        text,
        sceneText,
        choicesText,
        models,
        reset,
        sceneJson,
        setReset,
        setSceneJson,
    } = scene;
    const { setAllowRefresh, setLoading } = settings;
    const { setErrorInformation } = softError;
    const jsonRef = useRef<IJsonSave | undefined>(sceneJson);

    useEffect(() => {
        if (
            !background ||
            !splitBackground ||
            !text ||
            !sceneText ||
            !choicesText ||
            !models
        )
            return;
        const modifiedDateStamp = new Date().toISOString();
        const currentBackground = !background?.upload
            ? background?.filename
            : "/img/Background_Between_Worlds.jpg";
        const currentSplitBackground = {
            first: splitBackground.first.filename,
            second: splitBackground.second.filename,
        };
        const currentLighting = lighting
            ? lighting
            : {
                  red: 1,
                  green: 1,
                  blue: 1,
                  brightness: 1,
                  saturation: 1,
              };
        const currentText = {
            nameTag: text?.nameTagString,
            dialogue: text?.dialogueString,
        };
        const currentSceneText = sceneText?.textString;
        const currentChoicesText = {
            first: choicesText?.firstChoiceTextString,
            second: choicesText?.secondChoiceTextString,
        };
        const currentModels = Object.values(models)
            .map((model) => {
                if (model.from === "upload") return undefined;
                if (model.modelName.includes("kisaragi"))
                    return {
                        from: "/ / // / /",
                        character: "",
                        modelName: "",
                        modelTransform: {
                            x: 0,
                            y: 0,
                            scale: 0,
                            rotation: 0,
                        },
                        modelExpression: 0,
                        modelPose: 0,
                        modelParametersChanged: {},
                        modelIdle: false,
                    };
                if (model.character === "none" || model.character === "custom")
                    return undefined;
                return {
                    from: model.from,
                    character: model.character,
                    modelName: model.modelName,
                    modelTransform: {
                        x: model.modelX,
                        y: model.modelY,
                        scale: model.modelScale,
                        rotation: model.modelRotation,
                        blur: model.modelBlur,
                        opacity: model.modelOpacity,
                    },
                    modelExpression: model.expression,
                    modelPose: model.pose,
                    modelParametersChanged: model.parametersChanged,
                    modelIdle: model.idle,
                };
            })
            .filter((model) => model !== undefined);
        setValidModelCount(currentModels.length);

        setSceneJson({
            lastModified: modifiedDateStamp,
            background: currentBackground,
            splitBackground: currentSplitBackground,
            lighting: currentLighting,
            text: currentText,
            sceneText: currentSceneText,
            choicesText: currentChoicesText,
            models: currentModels,
        });
        setAllowRefresh(false);
    }, [
        background,
        splitBackground,
        text,
        sceneText,
        choicesText,
        models,
        lighting,
    ]);

    useEffect(() => {
        jsonRef.current = sceneJson;
    }, [sceneJson]);

    useEffect(() => {
        const interval = setInterval(
            () => {
                localStorage.setItem(
                    "autoSave",
                    JSON.stringify(jsonRef.current),
                );
            },
            1000 * 60 * 3,
        );

        return () => clearInterval(interval);
    }, []);

    const handleExport = () => {
        if (validModelCount <= 0) {
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

        setAllowRefresh(true);
    };

    const handleImport = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json, .sekaiscene";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
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
        input.click();
        input.remove();
    };

    return (
        <>
            <div id="export">
                <button
                    className="btn-circle btn-white"
                    onClick={() => setShow(true)}
                >
                    <i className="bi bi-braces sidebar__select"></i>
                </button>
            </div>
            {show && (
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
                            value={
                                sceneJson && JSON.stringify(sceneJson, null, 2)
                            }
                            readOnly
                        />
                    </div>
                </Window>
            )}
        </>
    );
};

export default ExportButton;
