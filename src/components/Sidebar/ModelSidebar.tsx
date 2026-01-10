import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { SceneContext } from "../../contexts/SceneContext";
import IModel from "../../types/IModel";
import {
    Live2DModel,
    Cubism4InternalModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import { ILive2DModelData } from "../../types/ILive2DModelData";
import { ILive2DModelList } from "../../types/ILive2DModelList";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";
import Window from "../UI/Window";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import IEmotionBookmark from "../../types/IEmotionBookmark";
import SidebarOption from "../UI/SidebarOption";
import { loadModel } from "../../utils/LoadModel";
import SelectedLayer from "./Options/Model/SelectedLayer";
import Character from "./Options/Model/Character";
import Costume from "./Options/Model/Costume";
import Emotion from "./Options/Model/Emotion";
import Transform from "./Options/Model/Transform";
import Mouth from "./Options/Model/Mouth";
import Live2D from "./Options/Model/Live2D";
import { IEmotionName } from "../../types/IEmotionName";

const ModelSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);

    if (!scene || !settings || !softError) {
        throw new Error("Context not found");
    }

    const {
        models,
        text,
        setModels,
        modelWrapper,
        currentKey,
        currentModel,
        setCurrentModel,
        initialState,
    } = scene;
    const { setLoading, openModelOption, setOpenModelOption } = settings;
    const { setErrorInformation } = softError;

    const abortController = useRef<AbortController | null>(null);

    const [currentSelectedCharacter, setCurrentSelectedCharacter] =
        useState<string>("custom");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");

    const [selectedParameter, setSelectedParameter] = useState<{
        idx: number;
        param: string;
    }>({ idx: -1, param: "_" });

    const [coreModel, setCoreModel] = useState<
        Cubism4InternalModel["coreModel"] | null
    >(null);

    const [live2DChangedWarnWindow, setLive2DChangedWarnWindow] =
        useState<boolean>(false);
    const [copiedParametersWindow, setCopiedParametersWindow] =
        useState<boolean>(false);
    const [live2DChangedFunction, setLive2DChangedFunction] = useState<
        (() => void) | undefined
    >(undefined);
    const [bookmarkEmotions, setBookmarkEmotion] = useState<IEmotionBookmark>(
        {}
    );
    const [nameEmotions, setNameEmotions] = useState<IEmotionName>({});

    useEffect(() => {
        if (!models || !currentKey || !currentModel) return;
        const model = models[currentKey];
        setCurrentModel(model);
        setCurrentSelectedCharacter(model?.character ?? "none");
    }, [models]);

    useEffect(() => {
        if (!models || !currentKey || !currentModel) return;
        if (currentModel?.model instanceof Live2DModel && !isLoading) {
            setCoreModel(
                currentModel.model.internalModel
                    .coreModel as Cubism4InternalModel["coreModel"]
            );
        } else {
            setCoreModel(null);
        }
    }, [currentModel, isLoading]);

    useEffect(() => {
        const bookmarkEmotionsCookie = localStorage.getItem(
            "bookmarkEmotionsCookie"
        );
        const bookmarkEmotionsJson = bookmarkEmotionsCookie
            ? JSON.parse(bookmarkEmotionsCookie)
            : {};

        setBookmarkEmotion(bookmarkEmotionsJson);

        const nameEmotionsCookie = localStorage.getItem("nameEmotionsCookie");
        const nameEmotionsJson = nameEmotionsCookie
            ? JSON.parse(nameEmotionsCookie)
            : {};
        setNameEmotions(nameEmotionsJson);

        if (text?.hideEverything) {
            setErrorInformation(t("error.hide-everything-warning"));
        }
    }, []);

    const prepareModel = useCallback(
        async (
            character: string,
            model: string | ILive2DModelList
        ): Promise<[Live2DModel, ILive2DModelData]> => {
            if (!currentModel) throw new Error("No current model selected!");
            setLoading(0);

            abortController.current?.abort();
            abortController.current = new AbortController();
            const { signal } = abortController.current;

            const modelName: string =
                typeof model === "object" && "modelBase" in model
                    ? model.modelBase
                    : model;
            const [live2DModel, modelData] = await loadModel(
                modelName,
                currentModel?.from,
                character,
                setLoadingMsg,
                setErrorInformation,
                setLoading,
                (x) => {
                    return x * 20;
                },
                signal
            );

            if (signal.aborted) throw new Error("Operation canceled.");

            const bounds = live2DModel.getLocalBounds();
            currentModel.root.removeChildren();
            currentModel.root.addChildAt(live2DModel, 0);
            currentModel.root.pivot.set(bounds.width / 2, bounds.height / 2);
            currentModel.root.scale.set(
                initialState ? 0.5 : currentModel?.modelScale
            );
            currentModel.root.position.set(
                initialState ? 640 : currentModel?.modelX,
                initialState ? 870 : currentModel?.modelY
            );

            setLoading(100);
            setLoadingMsg(``);

            return [live2DModel, modelData];
        },
        [currentModel, currentKey, modelWrapper]
    );

    if (!models) return <p>{t("please-wait")}</p>;

    const updateModelState = (updates: Partial<IModel>) => {
        setModels((prevModels) => ({
            ...prevModels,
            [currentKey]: {
                ...currentModel!,
                ...updates,
            },
        }));
        setCurrentModel((prevModel) => ({
            ...prevModel!,
            ...updates,
        }));
    };

    const handleLive2DChange = async (fn: () => void) => {
        if (
            currentModel?.parametersChanged &&
            Object.keys(currentModel.parametersChanged).length > 0
        ) {
            setLive2DChangedWarnWindow(true);
            setLive2DChangedFunction(() => fn);
            return;
        }

        fn();
    };

    return (
        <div>
            <h1>{t("model.header")}</h1>

            <SidebarOption
                header={t("model.selected-layer.header")}
                option={openModelOption}
                setOption={setOpenModelOption}
                optionName="select-layer"
            >
                <SelectedLayer
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setCurrentSelectedCharacter={setCurrentSelectedCharacter}
                    setSelectedParameter={setSelectedParameter}
                    setCoreModel={setCoreModel}
                    updateModelState={updateModelState}
                    handleLive2DChange={handleLive2DChange}
                />
            </SidebarOption>

            {loadingMsg && (
                <div className="option">
                    <p>{loadingMsg}</p>
                    {currentModel?.from === "sekai" &&
                        currentModel?.character !== "others" && (
                            <>
                                <p>
                                    <br />
                                    {t("model.long-wait")}
                                </p>
                            </>
                        )}
                    <button
                        className="btn-regular btn-white btn-extend-width"
                        onClick={() => abortController.current?.abort()}
                        disabled={abortController.current?.signal.aborted}
                    >
                        {t("global.cancel")}
                    </button>
                </div>
            )}
            <SidebarOption
                header={t("model.character.header")}
                option={openModelOption}
                setOption={setOpenModelOption}
                optionName="character"
            >
                <Character
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    currentSelectedCharacter={currentSelectedCharacter}
                    setCurrentSelectedCharacter={setCurrentSelectedCharacter}
                    handleLive2DChange={handleLive2DChange}
                    prepareModel={prepareModel}
                    updateModelState={updateModelState}
                    setLoadingMsg={setLoadingMsg}
                    setSelectedParameter={setSelectedParameter}
                />
            </SidebarOption>

            {currentSelectedCharacter != "custom" && (
                <>
                    <SidebarOption
                        header={t("model.costume.header")}
                        option={openModelOption}
                        setOption={setOpenModelOption}
                        optionName="costume"
                    >
                        <Costume
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            currentSelectedCharacter={currentSelectedCharacter}
                            handleLive2DChange={handleLive2DChange}
                            prepareModel={prepareModel}
                            updateModelState={updateModelState}
                            setSelectedParameter={setSelectedParameter}
                            setCurrentSelectedCharacter={
                                setCurrentSelectedCharacter
                            }
                            setLoadingMsg={setLoadingMsg}
                        />
                    </SidebarOption>
                </>
            )}
            {currentModel?.model instanceof Live2DModel && (
                <SidebarOption
                    header={t("model.emotion.header")}
                    option={openModelOption}
                    setOption={setOpenModelOption}
                    optionName="emotion"
                >
                    <Emotion
                        setIsLoading={setIsLoading}
                        setLoadingMsg={setLoadingMsg}
                        bookmarkEmotions={bookmarkEmotions}
                        setBookmarkEmotion={setBookmarkEmotion}
                        nameEmotions={nameEmotions}
                        setNameEmotions={setNameEmotions}
                        updateModelState={updateModelState}
                    />
                </SidebarOption>
            )}
            <SidebarOption
                header={t("model.transform.header")}
                option={openModelOption}
                setOption={setOpenModelOption}
                optionName="transform"
            >
                <Transform updateModelState={updateModelState} />
            </SidebarOption>

            {currentModel?.model instanceof Live2DModel && !isLoading && (
                <>
                    <SidebarOption
                        header={t("model.mouth.header")}
                        option={openModelOption}
                        setOption={setOpenModelOption}
                        optionName="mouth"
                    >
                        <Mouth
                            coreModel={coreModel!}
                            updateModelState={updateModelState}
                        />
                    </SidebarOption>
                    <SidebarOption
                        header={t("model.live2d.header")}
                        option={openModelOption}
                        setOption={setOpenModelOption}
                        optionName="live2d"
                    >
                        <Live2D
                            coreModel={coreModel!}
                            updateModelState={updateModelState}
                            selectedParameter={selectedParameter}
                            setSelectedParameter={setSelectedParameter}
                            setCopiedParametersWindow={
                                setCopiedParametersWindow
                            }
                        />
                    </SidebarOption>
                </>
            )}
            {live2DChangedWarnWindow && (
                <Window
                    show={setLive2DChangedWarnWindow}
                    confirmFunction={live2DChangedFunction}
                    confirmLabel={t("global.continue-ok")}
                    danger
                >
                    <div className="window__content">
                        <div className="window__divider">
                            <h3 className="text-center">
                                {t("model.live2d-changed-warn")}
                            </h3>
                        </div>
                    </div>
                </Window>
            )}

            {copiedParametersWindow && (
                <Window show={setCopiedParametersWindow} id="export-screen">
                    <div className="window__content">
                        <h1>{t("model.live2d.emotion-copy.confirm-header")}</h1>
                        <p>
                            {t("model.live2d.emotion-copy.confirm-description")}
                        </p>
                        <textarea
                            name=""
                            id=""
                            value={JSON.stringify(
                                currentModel?.parametersChanged,
                                null,
                                2
                            )}
                            readOnly
                        ></textarea>
                    </div>
                </Window>
            )}
        </div>
    );
};

export default ModelSidebar;
