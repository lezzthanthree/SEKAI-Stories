import React, { useContext } from "react";
import { SceneContext } from "../../../../contexts/SceneContext";
import IModel from "../../../../types/IModel";
import Live2DInputSlider from "../../../UI/Live2DInputSlider";
import { Cubism4InternalModel } from "@sekai-world/pixi-live2d-display-mulmotion";

interface MouthProps {
    coreModel?: Cubism4InternalModel["coreModel"];
    updateModelState: (updates: Partial<IModel>) => void;
}

const Mouth: React.FC<MouthProps> = ({ coreModel, updateModelState }) => {
    const scene = useContext(SceneContext);

    if (!scene) {
        throw new Error("Context not found");
    }
    const { currentModel } = scene;

    if (!currentModel || !coreModel) return;

    const handleLive2DParamsChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        params: string
    ) => {
        const newValue = Number(e.target.value);
        coreModel?.setParameterValueById(params, newValue);
        updateModelState({
            parametersChanged: {
                ...currentModel?.parametersChanged,
                [params]: newValue,
            },
        });
    };

    return (
        <>
            {coreModel["_parameterIds"]
                .map((param: string, idx: number) => {
                    if (!param.includes("Mouth")) return;
                    return (
                        <Live2DInputSlider
                            key={param}
                            idx={idx}
                            param={param}
                            coreModel={coreModel}
                            onChange={handleLive2DParamsChange}
                            currentModel={currentModel}
                            filter
                        />
                    );
                })
                .filter(Boolean)}
        </>
    );
};

export default Mouth;
