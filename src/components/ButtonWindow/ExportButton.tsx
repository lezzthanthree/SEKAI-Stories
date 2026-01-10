import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../contexts/SceneContext";
import { IJsonSave } from "../../types/IJsonSave";
import { ValidateJsonSave } from "../../utils/ValidateJsonSave";
import { getBackground } from "../../utils/GetBackground";
import {
    Live2DModel,
    Cubism4InternalModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import IModel from "../../types/IModel";
import Window from "../UI/Window";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { loadModel } from "../../utils/LoadModel";
import * as PIXI from "pixi.js";
import { AdjustmentFilter } from "pixi-filters";

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
        models,
        modelWrapper,
        reset,
        sceneJson,
        setBackground,
        setSplitBackground,
        setLighting,
        setText,
        setModels,
        setLayers,
        setNextLayer,
        setReset,
        setSceneJson,
    } = scene;
    const { setAllowRefresh, setLoading } = settings;
    const { setErrorInformation } = softError;
    const jsonRef = useRef<IJsonSave | undefined>(sceneJson);

    useEffect(() => {
        if (
            background === undefined ||
            splitBackground === undefined ||
            text === undefined ||
            models === undefined
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
            models: currentModels,
        });
        setAllowRefresh(false);
    }, [background, splitBackground, text, models, lighting]);

    useEffect(() => {
        jsonRef.current = sceneJson;
    }, [sceneJson]);
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem("autoSave", JSON.stringify(jsonRef.current));
        }, 1000 * 60 * 3);

        return () => clearInterval(interval);
    }, []);

    const loadScene = async (data: IJsonSave) => {
        setLoading(0);
        setLoadingMsg("Fetching background...");
        const backgroundData = data.background;
        setLoading(5);
        const backgroundSprite = await getBackground(backgroundData);
        const firstBackgroundData = data.splitBackground.first;
        const secondBackgroundData = data.splitBackground.second;
        setLoading(10);
        const firstBackgroundSprite = await getBackground(firstBackgroundData);
        setLoading(15);
        const secondBackgroundSprite = await getBackground(
            secondBackgroundData
        );

        if (
            !backgroundSprite ||
            !firstBackgroundSprite ||
            !secondBackgroundSprite
        ) {
            throw new Error(
                "Error from background. Could be that the background does not exist."
            );
        }

        const lightingData = data.lighting
            ? data.lighting
            : {
                  red: 1,
                  green: 1,
                  blue: 1,
                  brightness: 1,
                  saturation: 1,
              };

        setLoading(20);
        setLoadingMsg("Fetching text...");
        const textNameTag = data.text.nameTag;
        const textDialogue = data.text.dialogue;

        const modelJson = data.models;

        if (modelJson.length <= 0)
            throw new Error("JSON should have at least one model.");

        let modelTextures: Record<string, IModel> = {};

        modelWrapper?.removeChildren();

        for (const [idx, model] of modelJson.entries()) {
            const [live2DModel, modelData] = await loadModel(
                model.modelName,
                model.from,
                model.character,
                setLoadingMsg,
                setErrorInformation,
                setLoading,
                (x) => {
                    const totalSteps = modelJson.length * 5;
                    const currentStep = idx * 5 + x;
                    return 20 + (60 / (totalSteps - 1)) * currentStep;
                }
            );

            const modelContainer = new PIXI.Container();
            modelContainer.addChildAt(live2DModel, 0);

            modelContainer.pivot.set(
                modelContainer.width / 2,
                modelContainer.height / 2
            );
            modelContainer.scale.set(model.modelTransform?.scale ?? 0.5);
            modelContainer.position.set(
                model.modelTransform?.x ?? 640,
                model.modelTransform?.y ?? 870
            );
            modelContainer.angle = model.modelTransform?.rotation ?? 0;
            const blurFilter = new PIXI.BlurFilter(
                model.modelTransform?.blur ?? 0
            );
            modelContainer.filters = [blurFilter];
            modelWrapper?.addChildAt(modelContainer, idx);
            if (model.modelExpression && model.modelExpression !== 99999) {
                const manager =
                    live2DModel.internalModel.parallelMotionManager[0];
                manager.startMotion("Expression", model.modelExpression);
            }
            if (model.modelPose && model.modelPose !== 99999) {
                const manager =
                    live2DModel.internalModel.parallelMotionManager[1];
                manager.startMotion("Motion", model.modelPose);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (model?.modelParametersChanged) {
                const coreModel = live2DModel.internalModel
                    .coreModel as Cubism4InternalModel["coreModel"];
                Object.entries(model.modelParametersChanged).forEach(
                    ([name, value]) => {
                        try {
                            coreModel?.setParameterValueById(name, value);
                        } catch {
                            return;
                        }
                    }
                );
            }

            if (
                model?.modelIdle === false &&
                live2DModel instanceof Live2DModel &&
                "breath" in live2DModel.internalModel
            ) {
                const modelBreath = live2DModel.internalModel
                    .breath as Cubism4InternalModel["breath"];
                modelBreath.setParameters([]);
            }
            modelTextures = {
                ...modelTextures,
                [`character${idx + 1}`]: {
                    character: model.character,
                    root: modelContainer,
                    model: live2DModel,
                    modelName: model.modelName,
                    modelX: modelContainer.x,
                    modelY: modelContainer.y,
                    modelScale: modelContainer.scale.x,
                    modelRotation: modelContainer.angle,
                    modelBlur: model.modelTransform?.blur ?? 0,
                    modelData: modelData,
                    virtualEffect: false,
                    expression: model.modelExpression ?? 99999,
                    pose: model.modelPose ?? 99999,
                    idle: model.modelIdle,
                    visible: true,
                    from: model.from,
                    parametersChanged: model.modelParametersChanged
                        ? model.modelParametersChanged
                        : {},
                },
            };
        }

        setLoading(80);
        background?.backgroundContainer.removeChildAt(0);
        background?.backgroundContainer.addChildAt(backgroundSprite, 0);
        if (background?.backgroundContainer) {
            setBackground({
                ...background,
                filename: backgroundData,
            });
        }

        splitBackground?.first.backgroundContainer.removeChildAt(0);
        splitBackground?.first.backgroundContainer.addChildAt(
            firstBackgroundSprite,
            0
        );
        splitBackground?.second.backgroundContainer.removeChildAt(0);
        splitBackground?.second.backgroundContainer.addChildAt(
            secondBackgroundSprite,
            0
        );
        if (splitBackground?.splitContainer) {
            setSplitBackground({
                ...splitBackground,
                first: {
                    ...splitBackground.first,
                    filename: firstBackgroundData,
                },
                second: {
                    ...splitBackground.second,
                    filename: secondBackgroundData,
                },
            });
        }

        if (lighting) {
            if (!modelWrapper?.filters) return;
            const lightingFilter = modelWrapper?.filters[0] as AdjustmentFilter;
            Object.entries(lightingData).forEach(([key, value]) => {
                switch (key) {
                    case "red":
                        lightingFilter.red = value;
                        break;
                    case "green":
                        lightingFilter.green = value;
                        break;
                    case "blue":
                        lightingFilter.blue = value;
                        break;
                    case "brightness":
                        lightingFilter.brightness = value;
                        break;
                    case "saturation":
                        lightingFilter.saturation = value;
                        break;
                    default:
                        break;
                }
            });
            const newLighting = {
                ...lightingData,
            };
            setLighting(newLighting);
        }

        if (text && text.nameTag && text.dialogue) {
            text.nameTag.text = textNameTag;
            text.nameTag.updateText(true);
            text.dialogue.text = textDialogue;
            text.dialogue.updateText(true);
            setText({
                ...text,
                nameTagString: textNameTag,
                dialogueString: textDialogue,
            });
        }

        setModels(modelTextures);
        setLayers(Object.keys(modelTextures).length);
        setNextLayer(Object.keys(modelTextures).length);
        setLoadingMsg("");
        setLoading(100);
    };

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
                            await loadScene(data);
                            setSceneJson(data);
                        } else {
                            setErrorInformation(t("error.invalid-json"));
                            return;
                        }
                    } catch (error) {
                        setErrorInformation(
                            `${String(error)}\n${t("error.import-scene-fail")}`
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
