import React, { Dispatch, SetStateAction, useContext } from "react";
import staticCharacterData from "../../../../character.json";
import sekaiCharacterData from "../../../../character_sekai.json";
import { SceneContext } from "../../../../contexts/SceneContext";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import { ILive2DModelList } from "../../../../types/ILive2DModelList";
import { useTranslation } from "react-i18next";
import IModel from "../../../../types/IModel";
import { ILive2DModelData } from "../../../../types/ILive2DModelData";
import { Live2DModel } from "@sekai-world/pixi-live2d-display-mulmotion";

interface CharacterProps {
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

const Character: React.FC<CharacterProps> = ({
    isLoading,
    setIsLoading,
    setLoadingMsg,
    currentSelectedCharacter,
    setCurrentSelectedCharacter,
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
    const { currentModel, initialState, setInitialState } = scene;
    const { setLoading } = settings;
    const { setErrorInformation } = softError;

    const handleCharacterChange = async (value: string) => {
        setIsLoading(true);
        const character = value;
        setCurrentSelectedCharacter(character);

        try {
            if (!currentModel) return;

            const isStatic = currentModel.from === "static";
            const characterData = isStatic
                ? staticCharacterData[
                      character as keyof typeof staticCharacterData
                  ]
                : sekaiCharacterData[
                      character as keyof typeof sekaiCharacterData
                  ];

            if (!characterData || characterData.length === 0) {
                setErrorInformation(
                    "No models found for the selected character."
                );
                throw new Error("No models found for the selected character.");
            }

            const firstFile = isStatic
                ? characterData[0]
                : (characterData[0] as ILive2DModelList);

            const [live2DModel, modelData] = await prepareModel(
                character,
                firstFile
            );

            updateModelState({
                character,
                model: live2DModel,
                pose: 99999,
                expression: 99999,
                virtualEffect: false,
                modelName: isStatic
                    ? (firstFile as string)
                    : (firstFile as ILive2DModelList).modelBase,
                modelData,
                visible: true,
                idle: true,
                modelX: initialState ? 640 : currentModel?.modelX,
                modelY: initialState ? 870 : currentModel?.modelY,
                modelScale: initialState ? 0.5 : currentModel?.modelScale,
                modelBlur: currentModel?.modelBlur,
                parametersChanged: {},
                from:
                    currentModel.from === "upload"
                        ? "sekai"
                        : currentModel.from,
            });
            setSelectedParameter({ idx: -1, param: "_" });
            setInitialState(false);
        } catch (error) {
            setErrorInformation(String(error));
            setLoadingMsg("Failed to load model!");
            setLoading(100);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <select
                value={currentSelectedCharacter}
                onChange={(e) => {
                    const value = e.target.value;
                    handleLive2DChange(() => handleCharacterChange(value));
                }}
                disabled={isLoading}
            >
                <option value="none" disabled>
                    {t("model.character.select-character")}
                </option>
                {currentSelectedCharacter === "custom" && (
                    <option value="custom" disabled>
                        {t("character.custom")}
                    </option>
                )}
                {currentSelectedCharacter === "blank" && (
                    <option value="blank" disabled>
                        {t("character.blank")}
                    </option>
                )}
                {currentModel?.character !== "blank" &&
                    Object.keys(
                        currentModel?.from === "static"
                            ? staticCharacterData
                            : sekaiCharacterData
                    ).map((character) => (
                        <option key={character} value={character}>
                            {t(`character.${character}`)}
                        </option>
                    ))}
            </select>
        </>
    );
};

export default Character;
