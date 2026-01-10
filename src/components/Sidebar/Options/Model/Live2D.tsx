import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import IModel from "../../../../types/IModel";
import Live2DInputSlider from "../../../UI/Live2DInputSlider";
import {
    Cubism4InternalModel,
    Live2DModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import { ILive2DParameterJsonSave } from "../../../../types/ILive2DParameterJsonSave";
import { ValidateLive2DParameterJsonSave } from "../../../../utils/ValidateJsonSave";
import { Checkbox } from "../../../UI/Checkbox";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";

interface Live2DProps {
    coreModel?: Cubism4InternalModel["coreModel"];
    updateModelState: (updates: Partial<IModel>) => void;
    selectedParameter: { idx: number; param: string };
    setSelectedParameter: Dispatch<
        SetStateAction<{ idx: number; param: string }>
    >;
    setCopiedParametersWindow: Dispatch<SetStateAction<boolean>>;
}

const defaultModelBreath = [
    {
        parameterId: "ParamAngleX",
        offset: 0,
        peak: 15,
        cycle: 6.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamAngleY",
        offset: 0,
        peak: 8,
        cycle: 3.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamAngleZ",
        offset: 0,
        peak: 10,
        cycle: 5.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamBodyAngleX",
        offset: 0,
        peak: 4,
        cycle: 15.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamBreath",
        offset: 0,
        peak: 0.5,
        cycle: 3.2345,
        weight: 0.5,
    },
];

const Live2D: React.FC<Live2DProps> = ({
    coreModel,
    updateModelState,
    selectedParameter,
    setSelectedParameter,
    setCopiedParametersWindow,
}) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const softError = useContext(SoftErrorContext);

    const live2dSelect = useRef<HTMLSelectElement | null>(null);

    if (!scene || !softError) {
        throw new Error("Context not found");
    }
    const { currentModel } = scene;
    const { setErrorInformation } = softError;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const select = live2dSelect.current;

            if (!select) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handleLive2DParamsStep("-", selectedParameter?.param);
                return;
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                handleLive2DParamsStep("+", selectedParameter?.param);
                return;
            }

            let nextIndex = 0;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                nextIndex += 1;
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                nextIndex -= 1;
            } else {
                return;
            }

            const toSelectIndex = select.selectedIndex + nextIndex;
            if (toSelectIndex < 0 || toSelectIndex >= select.options.length) {
                return;
            }
            select.selectedIndex = toSelectIndex;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        };

        document.addEventListener("keydown", handler);

        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [selectedParameter]);

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

    const handleLive2DParamsStep = (type: string, params: string) => {
        let newValue: number = 0;
        const currentValue = coreModel?.getParameterValueById(params) ?? 0;
        const step = 0.1;
        switch (type) {
            case "+":
                newValue = currentValue + step;
                break;
            case "-":
                newValue = currentValue - step;
                break;
            case "0":
                newValue = 0;
                break;
            default:
                newValue = currentValue;
        }
        coreModel?.setParameterValueById(params, newValue);
        updateModelState({
            parametersChanged: {
                ...currentModel?.parametersChanged,
                [params]: newValue,
            },
        });
    };

    const copyEmotionParameters = () => {
        if (!coreModel || !currentModel) return;
        coreModel["_parameterIds"].map((param: string) => {
            const value = coreModel.getParameterValueById(param);
            currentModel.parametersChanged[param] = value;
        });
        setCopiedParametersWindow(true);
    };

    const handleIdle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        if (
            currentModel?.model instanceof Live2DModel &&
            "breath" in currentModel.model.internalModel
        ) {
            const modelBreath = currentModel.model.internalModel
                .breath as Cubism4InternalModel["breath"];
            modelBreath.setParameters(value ? defaultModelBreath : []);
            updateModelState({ idle: value });
        }
    };

    const handleImportLive2DParams = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json, .sekai2d";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                const jsonString = event.target?.result;
                if (typeof jsonString === "string") {
                    const data: ILive2DParameterJsonSave =
                        JSON.parse(jsonString);
                    if (ValidateLive2DParameterJsonSave(data)) {
                        const newParams: Record<string, number> = {};
                        Object.entries(data).forEach(([name, value]) => {
                            try {
                                coreModel?.setParameterValueById(name, value);
                                console.log(name, value);
                                newParams[name] = value;
                            } catch {
                                return;
                            }
                        });
                        updateModelState({
                            parametersChanged: {
                                ...currentModel?.parametersChanged,
                                ...newParams,
                            },
                        });
                    } else {
                        setErrorInformation(t("error.invalid-json"));
                    }
                }
            };
            reader.readAsText(file);
        };
        input.click();
        input.remove();
    };

    const handleExportLive2DParams = () => {
        const data = currentModel?.parametersChanged;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentModel?.character ?? "character"}_live2d.sekai2d`;
        a.click();
        a.remove();
    };

    return (
        <>
            <h3>{t("model.live2d.parameters.header")}</h3>
            {window.matchMedia &&
                window.matchMedia("(pointer: fine)").matches &&
                selectedParameter.idx === -1 && (
                    <div>
                        <p>{t("model.live2d.parameters.tooltip")}</p>
                    </div>
                )}
            {coreModel && (
                <>
                    <select
                        name="parameters"
                        id="parameters"
                        onChange={(e) => {
                            const [param, idx] = e.target.value.split(",");
                            setSelectedParameter({
                                idx: Number(idx),
                                param,
                            });
                        }}
                        value={`${selectedParameter?.param},${selectedParameter?.idx}`}
                        ref={live2dSelect}
                    >
                        <option value="_,-1" disabled>
                            {t("model.live2d.parameters.select-parameter")}
                        </option>
                        {coreModel["_parameterIds"].map(
                            (param: string, idx: number) => (
                                <option value={`${param},${idx}`} key={idx}>
                                    {param}
                                </option>
                            )
                        )}
                    </select>
                    {selectedParameter && selectedParameter.idx != -1 && (
                        <>
                            <Live2DInputSlider
                                idx={selectedParameter?.idx}
                                param={selectedParameter?.param}
                                coreModel={coreModel}
                                onChange={handleLive2DParamsChange}
                                currentModel={currentModel}
                            />

                            <div className="layer-buttons">
                                <button
                                    className="btn-circle btn-white"
                                    onClick={() => {
                                        handleLive2DParamsStep(
                                            "-",
                                            selectedParameter?.param
                                        );
                                    }}
                                >
                                    <i className="bi bi-caret-left-fill" />
                                </button>
                                <button
                                    className="btn-circle btn-white"
                                    onClick={() => {
                                        handleLive2DParamsStep(
                                            "0",
                                            selectedParameter?.param
                                        );
                                    }}
                                >
                                    <i className="bi bi-arrow-clockwise" />
                                </button>
                                <button
                                    className="btn-circle btn-white"
                                    onClick={() => {
                                        handleLive2DParamsStep(
                                            "+",
                                            selectedParameter?.param
                                        );
                                    }}
                                >
                                    <i className="bi bi-caret-right-fill" />
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
            <div className="option__content">
                <h3>{t("global.toggles")}</h3>
                <Checkbox
                    label={t("model.live2d.idle")}
                    checked={currentModel.idle}
                    id="idle"
                    onChange={handleIdle}
                />
            </div>
            <div className="option__content">
                <h3>{t("model.live2d.import-export.header")}</h3>
                <p>{t("model.live2d.import-export.description")}</p>
                <div>
                    <button
                        className="btn-regular btn-100 btn-blue"
                        onClick={handleImportLive2DParams}
                    >
                        {t("global.import")}
                    </button>
                    <button
                        className="btn-regular btn-100 btn-blue"
                        onClick={handleExportLive2DParams}
                    >
                        {t("global.export")}
                    </button>
                </div>
            </div>
            <div className="option__content">
                <h3>{t("model.live2d.emotion-copy.header")}</h3>
                <p>{t("model.live2d.emotion-copy.description")}</p>
                <div>
                    <button
                        className="btn-regular btn-100 btn-blue"
                        onClick={copyEmotionParameters}
                    >
                        {t("global.copy")}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Live2D;
