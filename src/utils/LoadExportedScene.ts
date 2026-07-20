import {
    Cubism4InternalModel,
    Live2DModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import { IJsonSave } from "../types/IJsonSave";
import { getBackground } from "./GetBackground";
import ISceneContextType from "../types/ISceneContextType";
import { loadModel } from "./LoadModel";
import IModel from "../types/IModel";
import { AdjustmentFilter } from "pixi-filters";
import { BlurFilter, Container } from "pixi.js";
import { Dispatch, SetStateAction } from "react";

export const loadScene = async (
    data: IJsonSave,
    setLoading: Dispatch<SetStateAction<number>>,
    setLoadingMsg: Dispatch<SetStateAction<string>>,
    setErrorInformation: Dispatch<SetStateAction<string>>,
    scene: ISceneContextType | undefined,
) => {
    if (!scene) throw new Error("Context not prepared.");

    const {
        background,
        splitBackground,
        lighting,
        text,
        sceneText,
        choicesText,
        modelWrapper,
        setBackground,
        setSplitBackground,
        setLighting,
        setText,
        setSceneText,
        setChoicesText,
        setModels,
        setLayers,
        setNextLayer,
    } = scene;

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
    const secondBackgroundSprite = await getBackground(secondBackgroundData);

    if (
        !backgroundSprite ||
        !firstBackgroundSprite ||
        !secondBackgroundSprite
    ) {
        throw new Error(
            "Error from background. Could be that the background does not exist.",
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
    const textNameTagData = data.text.nameTag;
    const textDialogueData = data.text.dialogue;

    const sceneTextData = data.sceneText;
    const choicesTextData = data.choicesText;

    const modelJsonData = data.models;

    if (modelJsonData.length <= 0)
        throw new Error("JSON should have at least one model.");

    let modelTextures: Record<string, IModel> = {};

    modelWrapper?.removeChildren();

    for (const [idx, model] of modelJsonData.entries()) {
        const [live2DModel, modelData] = await loadModel(
            model.modelName,
            model.from,
            model.character,
            setLoadingMsg,
            setErrorInformation,
            setLoading,
            (x) => {
                const totalSteps = modelJsonData.length * 5;
                const currentStep = idx * 5 + x;
                return 20 + (70 / (totalSteps - 1)) * currentStep;
            },
        );

        const modelContainer = new Container();
        modelContainer.addChildAt(live2DModel, 0);

        modelContainer.pivot.set(
            modelContainer.width / 2,
            modelContainer.height / 2,
        );
        modelContainer.scale.set(model.modelTransform?.scale ?? 0.5);
        modelContainer.position.set(
            model.modelTransform?.x ?? 640,
            model.modelTransform?.y ?? 870,
        );
        modelContainer.angle = model.modelTransform?.rotation ?? 0;
        const blurFilter = new BlurFilter(model.modelTransform?.blur ?? 0);
        const adjustmentFilter = new AdjustmentFilter({
            alpha: model.modelTransform?.opacity ?? 1,
        });
        modelContainer.filters = [blurFilter, adjustmentFilter];
        modelWrapper?.addChildAt(modelContainer, idx);
        if (model.modelExpression && model.modelExpression !== 99999) {
            const manager = live2DModel.internalModel.parallelMotionManager[0];
            manager.startMotion("Expression", model.modelExpression);
        }
        if (model.modelPose && model.modelPose !== 99999) {
            const manager = live2DModel.internalModel.parallelMotionManager[1];
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
                },
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
                modelOpacity: model.modelTransform?.opacity ?? 1,
                modelData: modelData,
                adjustmentFilter: adjustmentFilter,
                virtualEffect: false,
                virtualEffectEntity: null,
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

    setLoading(90);
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
        0,
    );
    splitBackground?.second.backgroundContainer.removeChildAt(0);
    splitBackground?.second.backgroundContainer.addChildAt(
        secondBackgroundSprite,
        0,
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

    if (text) {
        text.nameTag.forEach((t) => {
            t.text = textNameTagData;
            t.updateText(true);
        });
        text.dialogue.forEach((t) => {
            t.text = textDialogueData;
            t.updateText(true);
        });
        setText({
            ...text,
            nameTagString: textNameTagData,
            dialogueString: textDialogueData,
        });
    }

    if (sceneTextData && sceneText) {
        sceneText.text.forEach((t) => {
            t.text = sceneTextData;
            t.updateText(true);
        });
        setSceneText({
            ...sceneText,
            textString: sceneTextData,
        });
    }

    if (choicesTextData && choicesText) {
        choicesText.firstChoiceText.forEach((t) => {
            t.text = choicesTextData.first ?? "Choice 1";
            t.updateText(true);
        });
        choicesText.secondChoiceText.forEach((t) => {
            t.text = choicesTextData.second ?? "Choice 2";
            t.updateText(true);
        });

        setChoicesText({
            ...choicesText,
            firstChoiceTextString: choicesTextData.first ?? "Choice 1",
            secondChoiceTextString: choicesTextData.second ?? "Choice 2",
        });
    }

    setModels(modelTextures);
    setLayers(Object.keys(modelTextures).length);
    setNextLayer(Object.keys(modelTextures).length);
    setLoadingMsg("");
    setLoading(100);
};
