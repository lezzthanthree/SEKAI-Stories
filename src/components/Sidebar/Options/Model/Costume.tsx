import React, { Dispatch, SetStateAction, useContext } from "react";
import staticCharacterData from "../../../../character.json";
import sekaiCharacterData from "../../../../character_sekai.json";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import {
    virtualEffectCRT,
    virtualEffectParticles,
} from "../../../../utils/VirtualEffect";
import { Live2DModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import { ILive2DModelList } from "../../../../types/ILive2DModelList";
import { ILive2DModelData } from "../../../../types/ILive2DModelData";
import * as PIXI from "pixi.js";
import { Checkbox } from "../../../UI/Checkbox";
import IModel from "../../../../types/IModel";
import { GetCharacterDataFromSekai } from "../../../../utils/GetCharacterDataFromSekai";
import Live2DIssue from "../../../UI/Live2DIssue";

interface StaticCharacterData {
    [key: string]: string[];
}

const typedStaticCharacterData: StaticCharacterData = staticCharacterData;
interface SekaiCharacterData {
    [key: string]: ILive2DModelList[];
}

const typedSekaiCharacterData: SekaiCharacterData = sekaiCharacterData;

interface CostumeProps {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setLoadingMsg: Dispatch<SetStateAction<string>>;
    currentSelectedCharacter: string;
    setCurrentSelectedCharacter: Dispatch<SetStateAction<string>>;
    setSelectedParameter: Dispatch<
        SetStateAction<{ idx: number; param: string }>
    >;
    handleLive2DChange: (callback: () => void) => void;
    prepareModel: (
        character: string,
        model: string | ILive2DModelList
    ) => Promise<[Live2DModel, ILive2DModelData]>;
    updateModelState: (updates: Partial<IModel>) => void;
}

const Costume: React.FC<CostumeProps> = ({
    isLoading,
    setIsLoading,
    setLoadingMsg,
    currentSelectedCharacter,
    setSelectedParameter,
    handleLive2DChange,
    prepareModel,
    updateModelState,
}) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);

    if (!scene || !settings || !softError) {
        throw new Error("Context not found");
    }
    const { app, currentKey, currentModel } = scene;
    const { setLoading } = settings;
    const { setErrorInformation } = softError;
    if (!currentModel) return;

    const handleCostumeChange = async (value: string) => {
        setIsLoading(true);

        const modelBase = value;

        try {
            let live2DModel: Live2DModel;
            let modelData: ILive2DModelData;
            const isStatic = currentModel.from === "static";

            if (isStatic) {
                [live2DModel, modelData] = await prepareModel(
                    currentModel.character,
                    modelBase
                );
            } else {
                const model = await GetCharacterDataFromSekai(
                    currentSelectedCharacter,
                    modelBase
                );

                if (!model) {
                    setErrorInformation(
                        `No model found for ${modelBase} in sekai data`
                    );
                    throw new Error(
                        `No model found for ${modelBase} in sekai data`
                    );
                }

                [live2DModel, modelData] = await prepareModel(
                    currentModel.character,
                    model
                );
            }

            updateModelState({
                character: currentSelectedCharacter,
                model: live2DModel,
                pose: 99999,
                expression: 99999,
                virtualEffect: false,
                modelName: modelBase,
                modelData: modelData,
                visible: true,
                idle: true,
                parametersChanged: {},
                from:
                    currentModel.from === "upload"
                        ? "sekai"
                        : currentModel.from,
            });
            setSelectedParameter({ idx: -1, param: "_" });
        } catch (error) {
            setErrorInformation(String(error));
            setLoadingMsg("Failed to load model!");
            setLoading(100);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVirtualEffect = (value: boolean) => {
        if (!currentModel) return;

        virtualEffectParticles(
            currentModel.model as Live2DModel,
            currentKey,
            app as PIXI.Application,
            value
        );

        if (value && currentModel?.model) {
            const [crtFilter, adjustmentFilter] = virtualEffectCRT();

            currentModel.model.filters = [crtFilter, adjustmentFilter];
        } else {
            if (currentModel?.model) {
                currentModel.model.filters = [];
            }
        }
        updateModelState({
            virtualEffect: value,
        });
    };

    return (
        <>
            <select
                value={currentModel?.modelName}
                onChange={(e) => {
                    const value = e.target.value;
                    handleLive2DChange(() => handleCostumeChange(value));
                }}
                disabled={isLoading}
            >
                {(currentModel.from === "static"
                    ? typedStaticCharacterData[currentSelectedCharacter]
                    : typedSekaiCharacterData[currentSelectedCharacter]
                )?.map((model, idx) => {
                    const value =
                        currentModel.from === "static"
                            ? (model as string)
                            : (model as ILive2DModelList).modelBase;
                    return (
                        <option key={`${value}${idx}`} value={value}>
                            {value}
                        </option>
                    );
                })}
            </select>
            <Checkbox
                id="virtual-effect"
                label={t("model.costume.virtual")}
                checked={currentModel.virtualEffect}
                onChange={(event) => {
                    const value = event.target.checked;
                    handleVirtualEffect(value);
                }}
            />
            <Live2DIssue costume={currentModel.modelName} />
        </>
    );
};

export default Costume;
