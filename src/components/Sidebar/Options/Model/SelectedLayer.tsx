import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import * as PIXI from "pixi.js";
import { SceneContext } from "../../../../contexts/SceneContext";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import { useTranslation } from "react-i18next";
import AddModelSelect from "../../../Window/AddModelSelect";
import { Cubism4InternalModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import IModel from "../../../../types/IModel";

interface SelectedLayerProps {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setCurrentSelectedCharacter: Dispatch<SetStateAction<string>>;
    setSelectedParameter: Dispatch<
        SetStateAction<{ idx: number; param: string }>
    >;
    setCoreModel: Dispatch<
        SetStateAction<Cubism4InternalModel["coreModel"] | null>
    >;
    updateModelState: (updates: Partial<IModel>) => void;
    handleLive2DChange?: (callback: () => void) => void;
}

const SelectedLayer: React.FC<SelectedLayerProps> = ({
    isLoading,
    setIsLoading,
    setCurrentSelectedCharacter,
    setSelectedParameter,
    setCoreModel,
    updateModelState,
    handleLive2DChange = (callback) => callback(),
}) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const softError = useContext(SoftErrorContext);
    const [showAddModelScreen, setShowAddModelScreen] =
        useState<boolean>(false);

    if (!scene || !softError) {
        throw new Error("Context not found");
    }
    const {
        models,
        setModels,
        modelWrapper,
        nextLayer,
        setNextLayer,
        layers,
        setLayers,
        currentKey,
        setCurrentKey,
        currentModel,
        setCurrentModel,
        setInitialState,
    } = scene;

    const { setErrorInformation } = softError;

    if (!models || !currentModel) return <p>{t("please-wait")}</p>;

    const handleLayerChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const key = event?.target.value;
        setCurrentKey(key);
        setCurrentModel(models[key]);
        setCurrentSelectedCharacter(models[key].character);

        setSelectedParameter({ idx: -1, param: "_" });
    };

    const handleAddLayer = async (from: string) => {
        const modelName = "none";
        const texture = await PIXI.Texture.fromURL(
            "/img/Background_New_Layer.png"
        );
        const sprite = new PIXI.Sprite(texture);
        const modelContainer = new PIXI.Container();
        modelContainer.addChildAt(sprite, 0);
        modelWrapper?.addChildAt(modelContainer, layers);
        const blurFilter = new PIXI.BlurFilter(0);
        modelContainer.filters = [blurFilter];
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "none",
                root: modelContainer,
                modelName: modelName,
                model: sprite,
                modelX: 640,
                modelY: 870,
                modelRotation: 0,
                modelScale: 0.5,
                modelBlur: 0,
                virtualEffect: false,
                expression: 99999,
                pose: 99999,
                idle: true,
                visible: true,
                modelData: undefined,
                from: from,
                parametersChanged: {},
            },
        };
        setModels((prevModels) => ({
            ...prevModels,
            ...newLayer,
        }));
        setCurrentKey(`character${nextLayer + 1}`);
        setCurrentModel(newLayer[`character${nextLayer + 1}`]);
        setCurrentSelectedCharacter("none");
        setNextLayer(nextLayer + 1);
        setLayers(layers + 1);
        setInitialState(false);
    };

    const handleUploadImage = async (file: File) => {
        const imgSrc = URL.createObjectURL(file);
        const modelName = imgSrc;
        const texture = await PIXI.Texture.fromURL(modelName);
        const sprite = new PIXI.Sprite(texture);
        const modelContainer = new PIXI.Container();
        modelContainer.addChildAt(sprite, 0);
        modelWrapper?.addChildAt(modelContainer, layers);
        modelContainer.pivot.set(
            modelContainer.width / 2,
            modelContainer.height / 2
        );
        modelContainer.position.set(960, 540);
        const blurFilter = new PIXI.BlurFilter(0);
        modelContainer.filters = [blurFilter];
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "custom",
                root: modelContainer,
                modelName: modelName,
                model: sprite,
                modelX: 960,
                modelY: 540,
                modelRotation: 0,
                modelScale: sprite.scale.x,
                modelBlur: 0,
                virtualEffect: false,
                expression: 99999,
                pose: 99999,
                idle: true,
                visible: true,
                modelData: undefined,
                from: "upload",
                parametersChanged: {},
            },
        };
        setModels((prevModels) => ({
            ...prevModels,
            ...newLayer,
        }));
        setCurrentKey(`character${nextLayer + 1}`);
        setCurrentModel(newLayer[`character${nextLayer + 1}`]);
        setCurrentSelectedCharacter("custom");
        setNextLayer(nextLayer + 1);
        setLayers(layers + 1);
        setShowAddModelScreen(false);
    };

    const handleHideLayer = async () => {
        const visible = currentModel?.visible;

        if (currentModel?.model) {
            if (currentModel.modelName.includes("kisaragi")) {
                setErrorInformation(" ");
                return;
            }
            currentModel.root.visible = !visible;
        }
        updateModelState({ visible: !visible });
    };

    const handleDeleteLayer = async () => {
        const modelsObjects = Object.entries(scene.models ?? {});
        if (modelsObjects.length === 1) {
            if (currentModel.modelName.includes("kisaragi")) {
                setErrorInformation(" ");
            } else {
                setErrorInformation(
                    t("model.selected-layer.delete-model-warn")
                );
            }
            return;
        }

        setIsLoading(true);
        setCoreModel(null);
        currentModel?.model.destroy();
        currentModel?.root.destroy();
        delete models[currentKey];
        const firstKey = Object.keys(models)[0];
        setCurrentKey(firstKey);
        setCurrentModel(models[firstKey]);
        setCurrentSelectedCharacter(models[firstKey].character);
        setLayers(layers - 1);
        setIsLoading(false);
        setSelectedParameter({ idx: -1, param: "_" });
    };

    return (
        <>
            <select value={currentKey} onChange={handleLayerChange}>
                {Object.keys(models).map((model, idx) => (
                    <option key={model} value={model}>
                        {t("model.selected-layer.layer")} {idx + 1}:{" "}
                        {t(`character.${models[model].character}`)}
                    </option>
                ))}
            </select>
            <div className="layer-buttons">
                <button
                    className="btn-circle btn-white"
                    disabled={isLoading}
                    onClick={() => {
                        setShowAddModelScreen(!showAddModelScreen);
                    }}
                >
                    <i className="bi bi-plus-circle"></i>
                </button>
                {showAddModelScreen && (
                    <AddModelSelect
                        addModel={handleAddLayer}
                        setShow={setShowAddModelScreen}
                        uploadFunction={handleUploadImage}
                    />
                )}

                <button
                    className="btn-circle btn-white"
                    onClick={handleHideLayer}
                    disabled={isLoading}
                >
                    {currentModel.modelName.includes("kisaragi") ? (
                        <></>
                    ) : !currentModel?.visible ? (
                        <i className="bi bi-eye-slash"></i>
                    ) : (
                        <i className="bi bi-eye"></i>
                    )}
                </button>
                <button
                    className="btn-circle btn-white"
                    onClick={() => {
                        handleLive2DChange(() => handleDeleteLayer());
                    }}
                    disabled={isLoading}
                >
                    {currentModel.modelName.includes("kisaragi") ? (
                        <></>
                    ) : (
                        <i className="bi bi-x-circle"></i>
                    )}
                </button>
            </div>
        </>
    );
};

export default SelectedLayer;
