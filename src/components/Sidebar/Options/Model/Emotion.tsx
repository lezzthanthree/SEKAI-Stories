import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import { Live2DModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import IModel from "../../../../types/IModel";
import IEmotionBookmark from "../../../../types/IEmotionBookmark";
import { IEmotionName } from "../../../../types/IEmotionName";
import InputWindow from "../../../UI/InputWindow";

interface EmotionProps {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setLoadingMsg: Dispatch<SetStateAction<string>>;
    bookmarkEmotions: IEmotionBookmark;
    setBookmarkEmotion: Dispatch<SetStateAction<IEmotionBookmark>>;
    nameEmotions: IEmotionName;
    setNameEmotions: Dispatch<SetStateAction<IEmotionName>>;
    updateModelState: (updates: Partial<IModel>) => void;
}

const Emotion: React.FC<EmotionProps> = ({
    setIsLoading,
    setLoadingMsg,
    bookmarkEmotions,
    setBookmarkEmotion,
    nameEmotions,
    setNameEmotions,
    updateModelState,
}) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const [showRenameEmotionInput, setShowRenameEmotionInput] =
        useState<boolean>(false);
    const [emotionType, setEmotionType] = useState<string>("");

    if (!scene) {
        throw new Error("Context not found");
    }
    const { currentModel } = scene;

    if (!currentModel) return;

    const handleEmotionChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
        type: "expression" | "pose"
    ) => {
        if (currentModel?.model instanceof Live2DModel) {
            const value = Number(event?.target.value);
            const group =
                type === "expression"
                    ? "Expression"
                    : type === "pose"
                    ? "Motion"
                    : "";
            const selectedOption =
                event.target.options[event.target.selectedIndex].text;
            try {
                currentModel?.model.motion(group, value);
                updateModelState({ [type]: value });
            } catch {
                setLoadingMsg(`Fail to load ${selectedOption}!`);
                setIsLoading(true);
            }
        }
    };

    const handlePlayTogether = async () => {
        const model = currentModel.model;

        if (!(model instanceof Live2DModel)) return;

        if (currentModel.expression && currentModel.expression !== 99999) {
            const manager = model.internalModel.parallelMotionManager[0];
            manager.startMotion("Expression", currentModel.expression);
        }
        if (currentModel.pose && currentModel.pose !== 99999) {
            const manager = model.internalModel.parallelMotionManager[1];
            manager.startMotion("Motion", currentModel.pose);
        }
    };

    const handleNameEmotion = async (name: string) => {
        const key =
            emotionType === "pose"
                ? currentModel.modelData?.FileReferences.Motions.Motion[
                      currentModel.pose
                  ].Name
                : emotionType === "expression"
                ? currentModel.modelData?.FileReferences.Motions.Expression[
                      currentModel.expression
                  ].Name
                : "";

        if (!key) return;

        if (!name || name.trim() === "") {
            if (key in nameEmotions) {
                const updated = { ...nameEmotions };
                delete updated[key];
                setNameEmotions(updated);
                localStorage.setItem(
                    "nameEmotionsCookie",
                    JSON.stringify(updated)
                );
            }
            return;
        }
        setNameEmotions({ ...nameEmotions, [key]: name });
        localStorage.setItem(
            "nameEmotionsCookie",
            JSON.stringify({ ...nameEmotions, [key]: name })
        );
    };

    const handleBookmarkEmotion = async (type: "pose" | "expression") => {
        if (!currentModel) return;

        const key = `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`;
        const emotionValue =
            type === "pose" ? currentModel.pose : currentModel.expression;

        if (!bookmarkEmotions[key]) {
            bookmarkEmotions[key] = {
                pose: [],
                expression: [],
            };
        }

        const emotionArray = bookmarkEmotions[key][type];

        const index = emotionArray.indexOf(emotionValue);
        if (index !== -1) {
            emotionArray.splice(index, 1);
        } else {
            emotionArray.push(emotionValue);
        }

        localStorage.setItem(
            "bookmarkEmotionsCookie",
            JSON.stringify(bookmarkEmotions)
        );
        setBookmarkEmotion({ ...bookmarkEmotions });
    };

    return (
        <>
            <div className="option__content">
                <h3>{t("model.emotion.pose")}</h3>
                <select
                    value={currentModel?.pose}
                    onChange={(e) => {
                        handleEmotionChange(e, "pose");
                    }}
                >
                    <option value={99999} disabled>
                        {t("model.emotion.select-pose")}
                    </option>
                    {bookmarkEmotions[
                        `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                    ] &&
                        bookmarkEmotions[
                            `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                        ].pose.map((idx) => (
                            <option key={`faved-${idx}`} value={idx}>
                                ★{" "}
                                {currentModel.modelData?.FileReferences.Motions
                                    .Motion[idx]?.Name &&
                                    (nameEmotions[
                                        currentModel.modelData.FileReferences
                                            .Motions.Motion[idx].Name!
                                    ] ??
                                        currentModel.modelData.FileReferences
                                            .Motions.Motion[idx].Name)}
                            </option>
                        ))}
                    {currentModel &&
                        currentModel.modelData?.FileReferences.Motions.Motion.map(
                            (o, idx) => (
                                <option key={idx} value={idx}>
                                    {nameEmotions[o.Name] ?? o.Name}
                                </option>
                            )
                        )}
                </select>
                {currentModel?.pose !== 99999 && (
                    <div className="layer-buttons">
                        <button
                            className="btn-circle btn-blue"
                            onClick={async () => {
                                if (
                                    currentModel &&
                                    currentModel.model instanceof Live2DModel &&
                                    currentModel.pose !== 99999
                                ) {
                                    currentModel.model.motion(
                                        "Motion",
                                        currentModel.pose
                                    );
                                }
                            }}
                        >
                            <i className="bi bi-arrow-clockwise" />
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={async () => {
                                setEmotionType("pose");
                                setShowRenameEmotionInput(true);
                            }}
                        >
                            <i className="bi bi-pencil" />
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={() => handleBookmarkEmotion("pose")}
                        >
                            {bookmarkEmotions[
                                `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                            ] &&
                            bookmarkEmotions[
                                `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                            ].pose.includes(currentModel.pose) ? (
                                <i className="bi bi-star-fill sidebar__select" />
                            ) : (
                                <i className="bi bi-star sidebar__select" />
                            )}
                        </button>
                    </div>
                )}
            </div>
            <div className="option__content">
                <h3>{t("model.emotion.expression")}</h3>
                <select
                    value={currentModel?.expression}
                    onChange={(e) => {
                        handleEmotionChange(e, "expression");
                    }}
                >
                    <option value={99999} disabled>
                        {t("model.emotion.select-expression")}
                    </option>
                    {bookmarkEmotions[
                        `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                    ] &&
                        bookmarkEmotions[
                            `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                        ].expression.map((idx) => (
                            <option key={`faved-${idx}`} value={idx}>
                                ★{" "}
                                {currentModel.modelData?.FileReferences.Motions
                                    .Expression[idx]?.Name &&
                                    (nameEmotions[
                                        currentModel.modelData.FileReferences
                                            .Motions.Expression[idx].Name!
                                    ] ??
                                        currentModel.modelData.FileReferences
                                            .Motions.Expression[idx].Name)}
                            </option>
                        ))}
                    {currentModel &&
                        currentModel.modelData?.FileReferences.Motions.Expression.map(
                            (o, idx) => (
                                <option key={idx} value={idx}>
                                    {nameEmotions[o.Name] ?? o.Name}
                                </option>
                            )
                        )}
                </select>
                {currentModel?.expression !== 99999 && (
                    <div className="layer-buttons">
                        <button
                            className="btn-circle btn-blue"
                            onClick={async () => {
                                if (
                                    currentModel &&
                                    currentModel.model instanceof Live2DModel &&
                                    currentModel.expression !== 99999
                                ) {
                                    currentModel.model.motion(
                                        "Expression",
                                        currentModel.expression
                                    );
                                }
                            }}
                        >
                            <i className="bi bi-arrow-clockwise" />
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={async () => {
                                setEmotionType("expression");
                                setShowRenameEmotionInput(true);
                            }}
                        >
                            <i className="bi bi-pencil" />
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={() => handleBookmarkEmotion("expression")}
                        >
                            {bookmarkEmotions[
                                `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                            ] &&
                            bookmarkEmotions[
                                `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                            ].expression.includes(currentModel.expression) ? (
                                <i className="bi bi-star-fill " />
                            ) : (
                                <i className="bi bi-star " />
                            )}
                        </button>
                    </div>
                )}
            </div>
            <div className="option__content">
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={handlePlayTogether}
                >
                    Run Both
                </button>
            </div>
            {showRenameEmotionInput && (
                <InputWindow
                    show={setShowRenameEmotionInput}
                    confirmFunction={(x: string) => handleNameEmotion(x)}
                    description={t("model.emotion.rename-emotion")}
                />
            )}
        </>
    );
};

export default Emotion;
