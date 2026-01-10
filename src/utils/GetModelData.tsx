import axios from "axios";
import { ILive2DModelData } from "../types/ILive2DModelData";
import { ILive2DModelList } from "../types/ILive2DModelList";
import { sekaiUrl, staticUrl } from "./Constants";
import { GetMotionData } from "./GetMotionUrl";

export const GetModelDataFromStatic = async (
    characterFolder: string,
    modelName: string
): Promise<ILive2DModelData> => {
    const model = await axios.get(
        `${staticUrl}/model/${characterFolder}/${modelName}/${modelName}.model3.json`
    );
    const motion = await axios.get(
        `${staticUrl}/motion/${characterFolder}/BuildMotionData.json`
    );
    const modelData = model.data;
    const motionData = motion.data;
    modelData.url = `${staticUrl}/model/${characterFolder}/${modelName}/`;

    const motions = [];
    for (const elem of motionData.motions) {
        motions.push({
            Name: elem,
            File: `${staticUrl}/motion/${characterFolder}/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }
    const expressions = [];
    for (const elem of motionData.expressions) {
        expressions.push({
            Name: elem,
            File: `${staticUrl}/motion/${characterFolder}/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }

    modelData.FileReferences.Motions = {
        Motion: motions,
        Expression: expressions,
    };
    modelData.FileReferences.Expressions = {};
    return modelData;
};

export const GetModelDataFromSekai = async (
    modelList: ILive2DModelList
): Promise<ILive2DModelData> => {
    const model = await axios.get(
        `${sekaiUrl}/model/${modelList.modelPath}/${modelList.modelFile}`
    );
    const [motionBaseName, motionData] = await GetMotionData(modelList);
    const modelData = model.data;
    modelData.url = `${sekaiUrl}/model/${modelList.modelPath}/`;

    const motions = [];
    for (const elem of motionData.motions) {
        motions.push({
            Name: elem,
            File: `${sekaiUrl}/motion/${motionBaseName}/motion/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }
    const expressions = [];
    for (const elem of motionData.expressions) {
        expressions.push({
            Name: elem,
            File: `${sekaiUrl}/motion/${motionBaseName}/facial/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }

    modelData.FileReferences.Motions = {
        Motion: motions,
        Expression: expressions,
    };
    modelData.FileReferences.Expressions = {};
    return modelData;
};
