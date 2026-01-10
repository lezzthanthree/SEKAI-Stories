import { Cubism4InternalModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import React from "react";
import IModel from "../../types/IModel";
import { useTranslation } from "react-i18next";

interface Live2DInputSliderProps {
    idx: number;
    param: string;
    filter?: boolean;
    coreModel: Cubism4InternalModel["coreModel"];
    onChange: (e: React.ChangeEvent<HTMLInputElement>, param: string) => void;
    currentModel: IModel;
}

const Live2DInputSlider: React.FC<Live2DInputSliderProps> = ({
    idx,
    param,
    coreModel,
    filter = false,
    onChange,
    currentModel,
}) => {
    const { t } = useTranslation();

    if (idx == -1) return null;

    if (!coreModel || !currentModel) return null;

    const min = coreModel.getParameterMinimumValue(idx);
    const max = coreModel.getParameterMaximumValue(idx);
    const value = coreModel.getParameterValueById(param);

    return (
        <div className="option__content" key={param}>
            {filter && <h3>{t(`model.mouth.${param}`)}</h3>}
            <input
                type="range"
                name={param}
                id={param}
                min={min}
                max={max}
                step={0.01}
                value={currentModel.parametersChanged[param] ?? value}
                onChange={(e) => {
                    onChange(e, param);
                }}
            />
        </div>
    );
};

export default Live2DInputSlider;
