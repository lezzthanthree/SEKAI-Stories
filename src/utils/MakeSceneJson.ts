import IBackground from "../types/IBackground";
import IChoicesText from "../types/IChoicesText";
import { ILighting } from "../types/ILighting";
import IModel from "../types/IModel";
import ISceneText from "../types/ISceneText";
import { ISplitBackground } from "../types/ISplitBackground";
import IText from "../types/IText";

export const makeSceneJson = (
    background: IBackground,
    splitBackground: ISplitBackground,
    text: IText,
    sceneText: ISceneText,
    choicesText: IChoicesText,
    models: Record<string, IModel>,
    lighting: ILighting,
) => {
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
    const currentModels = Object.values(models || {})
        .map((model) => {
            if (model.from === "upload" || model.from == "roleplay")
                return undefined;
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

    return {
        modifiedDateStamp,
        currentBackground,
        currentSplitBackground,
        currentLighting,
        currentText,
        currentSceneText,
        currentChoicesText,
        currentModels,
    };
};
