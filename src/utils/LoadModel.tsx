import { Dispatch, SetStateAction } from "react";
import { ILive2DModelData } from "../types/ILive2DModelData";
import { GetCharacterFolder } from "./GetCharacterFolder";
import { GetModelDataFromSekai, GetModelDataFromStatic } from "./GetModelData";
import { t } from "i18next";
import axios from "axios";
import {
    Cubism4InternalModel,
    Live2DModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import { GetCharacterDataFromSekai } from "./GetCharacterDataFromSekai";

export const loadModel = async (
    model: string,
    from: string,
    character: string,
    setLoadingMsg: Dispatch<SetStateAction<string>>,
    setErrorInformation: Dispatch<SetStateAction<string>>,
    setLoading: Dispatch<SetStateAction<number>>,
    formula: (x: number) => number,
    abort?: AbortSignal
): Promise<[Live2DModel, ILive2DModelData]> => {
    setLoading(formula(0));
    setLoadingMsg(`${t("loadings.loading-1")} ${model}...`);
    let modelData: ILive2DModelData | undefined = undefined;
    if (from === "static") {
        const [characterFolder] = await GetCharacterFolder(model);

        modelData = await GetModelDataFromStatic(characterFolder, model);
    }
    if (from === "sekai" || from === "upload") {
        const characterData = await GetCharacterDataFromSekai(character, model);
        modelData = await GetModelDataFromSekai(characterData);
    }
    if (from === "/ / // / /") {
        throw new Error("I want to get out of here.");
    }

    if (!modelData) {
        setErrorInformation("Model data is undefined");
        throw new Error("Model data is undefined");
    }

    setLoading(formula(1));
    setLoadingMsg(`${t("loadings.loading-4")} ${model}...`);
    await axios.get(modelData.url + modelData.FileReferences.Textures[0], {
        signal: abort,
    });
    setLoading(formula(2));
    setLoadingMsg(`${t("loadings.loading-5")} ${model}...`);
    await axios.get(modelData.url + modelData.FileReferences.Moc, {
        signal: abort,
    });
    setLoading(formula(3));
    setLoadingMsg(`${t("loadings.loading-6")} ${model}...`);
    await axios.get(modelData.url + modelData.FileReferences.Physics, {
        signal: abort,
    });

    setLoading(formula(4));
    setLoadingMsg(`${t("loadings.loading-7")}...`);
    const live2DModel = await Live2DModel.from(modelData, {
        autoInteract: false,
    });

    if (abort?.aborted) throw new Error("Operation aborted.");
    
    const internalModel = live2DModel.internalModel;
    internalModel.extendParallelMotionManager(2);

    if (internalModel instanceof Cubism4InternalModel) {
        internalModel.coreModel.setOverwriteFlagForModelCullings(true);
    }

    return [live2DModel, modelData];
};
