import React, { useState } from "react";
import { SceneContext } from "./SceneContext";
import * as PIXI from "pixi.js";
import { Assets } from "@pixi/assets";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect } from "react";
import IModel from "../types/IModel";
import IBackground from "../types/IBackground";
import IText from "../types/IText";
import { getBackground } from "../utils/GetBackground";
import ISceneSetting from "../types/ISceneSetting";
import IGuideline from "../types/IGuideline";

interface AppProviderProps {
    children: React.ReactNode;
}

interface InitialScene {
    background: string;
    model: string;
    text: string;
    nameTag: string;
    character: string;
    modelX: number;
    modelY: number;
    pngName: string;
    sceneSetting: string;
}

const randomInitialScene: InitialScene[] = [
    {
        background: "/background_special/Background_Uranohoshi.jpg",
        model: "07airi_normal",
        text: "No, I will not do Ai♡Scream on you.",
        nameTag: "Airi",
        character: "airi",
        modelX: 650,
        modelY: 170,
        pngName: "airi",
        sceneSetting: "Uranohoshi High School Idol Club",
    },
    {
        background: "/background_compressed/bg_a001101.jpg",
        model: "v2_19ena_casual",
        text: "Mizuki, that's not how you break a KitKat!",
        nameTag: "Ena",
        character: "ena",
        modelX: 690,
        modelY: 135,
        pngName: "ena",
        sceneSetting: "Diner",
    },
    {
        background: "/background_compressed/bg_e000102.jpg",
        model: "v2_17kanade_casual",
        text: "Hashiridashita...?",
        nameTag: "Kanade",
        character: "kanade",
        modelX: 650,
        modelY: 170,
        pngName: "kanade",
        sceneSetting: "Kanade's Room",
    },
    {
        background: "/background_special/Background_SELF_CONTROL.jpg",
        model: "v2_20mizuki_school_back02",
        text: "I feel like I've heard this song before...",
        nameTag: "Mizuki",
        character: "mizuki",
        modelX: 935,
        modelY: 135,
        pngName: "mizuki",
        sceneSetting: "Shrine",
    },
];

export const SceneProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [openedSidebar, setOpenedSidebar] = useState<string>("text");
    const [app, setApp] = useState<PIXI.Application | undefined>(undefined);
    const [models, setModels] = useState<Record<string, IModel> | undefined>(
        undefined
    );
    const [layers, setLayers] = useState<number>(1);
    const [nextLayer, setNextLayer] = useState<number>(1);
    const [modelContainer, setModelContainer] = useState<
        PIXI.Container | undefined
    >(undefined);
    const [background, setBackground] = useState<IBackground | undefined>(
        undefined
    );
    const [text, setText] = useState<IText | undefined>(undefined);
    const [sceneSetting, setSceneSetting] = useState<ISceneSetting | undefined>(
        undefined
    );
    const [guideline, setGuideline] = useState<IGuideline | undefined>(
        undefined
    );
    const [reset, setReset] = useState<number>(0);
    const [hide, setHide] = useState<boolean>(false);
    const [hideAnnouncements, setHideAnnouncements] = useState<boolean>(true);
    const [showExperimental, setShowExperimental] = useState<boolean>(false);
    const [startingMessage, setStartingMessage] = useState<string>("");

    const getInitialScene = (scene?: string): InitialScene => {
        const date = new Date();
        const month = date.getMonth() + 1;

        if (month == 10) {
            return {
                background:
                    "/background_special/Background_Cheat_to_Happiness.jpg",
                model: "18mafuyu_cloth001",
                text: "→↓↑→→↓→→↑↑↓↓←→←→",
                nameTag: "Mafuyu",
                character: "mafuyu",
                modelX: 650,
                modelY: 0,
                pngName: "mafuyu",
                sceneSetting: "Mafuyu's Room",
            };
        }

        if (scene === "bad_apple") {
            return {
                background: "/background_compressed/bg00026.jpg",
                model: "17kanade_black",
                text: "Mizuki, what do you mean by ⑨?",
                nameTag: "Kanade",
                character: "kanade",
                modelX: 650,
                modelY: 170,
                pngName: "kanade_black",
                sceneSetting: "???",
            };
        }

        return randomInitialScene[
            Math.floor(Math.random() * randomInitialScene.length)
        ];
    };

    const initialScene: InitialScene = getInitialScene();

    useEffect(() => {
        const announcementCookie = localStorage.getItem("uiuxTest");
        if (Number(announcementCookie) < 1) {
            setHideAnnouncements(false);
        }
        const experimentalCookie = localStorage.getItem("showExperimental");
        if (experimentalCookie === "true") {
            setShowExperimental(true);
        }
        const textAlignmentCookie = localStorage.getItem("textAlignment");

        const runCanvas = async () => {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;

            if (app) {
                app?.stop();
            }

            const initApplication = new PIXI.Application({
                view: canvas,
                autoStart: true,
                width: 1920,
                height: 1080,
                backgroundColor: 0x000000,
            });

            Live2DModel.registerTicker(PIXI.Ticker);

            // Load Transparent (for development. idk why it causes issues before production)
            const transparentContainer = new PIXI.Container();
            const transparentSpriteForNameTag = await getBackground(
                "/background_special/Background_Transparent.png"
            );
            const transparentSpriteForDialogue = await getBackground(
                "/background_special/Background_Transparent.png"
            );
            const transparentSpriteForWhateverReason = await getBackground(
                "/background_special/Background_Transparent.png"
            );
            transparentContainer.addChildAt(transparentSpriteForNameTag, 0);
            transparentContainer.addChildAt(transparentSpriteForDialogue, 1);
            transparentContainer.addChildAt(
                transparentSpriteForWhateverReason,
                2
            );
            initApplication.stage.addChildAt(transparentContainer, 0);

            // Load Background
            setStartingMessage("Adding background...");
            const backgroundContainer = new PIXI.Container();
            const backgroundSprite = await getBackground(
                initialScene["background"]
            );
            backgroundContainer.addChild(backgroundSprite);
            initApplication.stage.addChildAt(backgroundContainer, 1);

            // Load Sample PNG Sprite
            const modelContainer = new PIXI.Container();
            const texture = await PIXI.Texture.fromURL(
                `/img/${initialScene.pngName}.png`
            );
            const sprite = new PIXI.Sprite(texture);
            modelContainer.addChildAt(sprite, 0);
            sprite.position.set(initialScene["modelX"], initialScene["modelY"]);

            initApplication.stage.addChildAt(modelContainer, 2);

            // Load Text
            setStartingMessage("Adding text...");
            const textContainer = new PIXI.Container();
            const textBackgroundTexture = await Assets.load(
                "/img/Dialogue_Background.png"
            );
            const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
            textBackgroundSprite.width = 1920;
            textBackgroundSprite.height = 1080;

            const textNameTag = new PIXI.Text(initialScene["nameTag"], {
                fontFamily: "FOT-RodinNTLGPro-EB",
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            });
            textNameTag.position.set(225, 780 + Number(textAlignmentCookie));

            const textDialogue = new PIXI.Text(initialScene["text"], {
                fontFamily: "FOT-RodinNTLGPro-DB",
                fontSize: 44,
                fill: 0xffffff,
                stroke: 0x5d5d79,
                strokeThickness: 8,
                wordWrap: true,
                wordWrapWidth: 1300,
                breakWords: true,
            });
            textDialogue.position.set(245, 845 + Number(textAlignmentCookie));

            textContainer.addChildAt(textBackgroundSprite, 0);
            textContainer.addChildAt(textNameTag, 1);
            textContainer.addChildAt(textDialogue, 2);

            initApplication.stage.addChildAt(textContainer, 3);

            // Load Scene Setting Text
            const sceneSettingContainer = new PIXI.Container();
            const sceneSettingBackgroundTexture = await Assets.load(
                "/img/SceneSetting_Background.png"
            );
            const sceneSettingBackgroundSprite = new PIXI.Sprite(
                sceneSettingBackgroundTexture
            );
            const sceneSettingText = new PIXI.Text(
                initialScene["sceneSetting"],
                {
                    fontFamily: "FOT-RodinNTLGPro-DB",
                    fontSize: 44,
                    fill: 0xffffff,
                    align: "center",
                }
            );
            sceneSettingText.anchor.set(0.5, 0.5);
            sceneSettingText.position.set(960, 540);

            sceneSettingContainer.addChildAt(sceneSettingBackgroundSprite, 0);
            sceneSettingContainer.addChildAt(sceneSettingText, 1);

            initApplication.stage.addChildAt(sceneSettingContainer, 4);
            sceneSettingContainer.visible = false;

            // Load Guideline Tools
            const guidelineContainer = new PIXI.Container();
            const gridTexture = await Assets.load("/img/grid.png");
            const gridSprite = new PIXI.Sprite(gridTexture);
            guidelineContainer.addChild(gridSprite);
            guidelineContainer.visible = false;
            guidelineContainer.alpha = 0.2;
            initApplication.stage.addChildAt(guidelineContainer, 5);

            setApp(initApplication);
            setModels({
                character1: {
                    character: initialScene["character"],
                    model: sprite,
                    modelName: initialScene["model"],
                    modelX: sprite.x,
                    modelY: sprite.y,
                    modelScale: sprite.scale.x,
                    modelData: undefined,
                    virtualEffect: false,
                    expression: 0,
                    pose: 0,
                    idle: true,
                    visible: true,
                    from: "sekai",
                },
            });
            setModelContainer(modelContainer);
            setBackground({
                backgroundContainer: backgroundContainer,
                filename: initialScene["background"],
                upload: false,
            });
            setText({
                textContainer: textContainer,
                nameTag: textNameTag,
                dialogue: textDialogue,
                nameTagString: initialScene["nameTag"],
                dialogueString: initialScene["text"],
                fontSize: 44,
                visible: true,
                yOffset: textAlignmentCookie ? Number(textAlignmentCookie) : 0,
            });
            setSceneSetting({
                sceneSettingContainer: sceneSettingContainer,
                text: sceneSettingText,
                textString: initialScene["sceneSetting"],
                visible: false,
            });
            setGuideline({
                container: guidelineContainer,
                visible: false,
            });
            setStartingMessage("");
        };
        runCanvas();
    }, [reset]);

    return (
        <SceneContext.Provider
            value={{
                openedSidebar,
                setOpenedSidebar,
                app,
                setApp,
                models,
                setModels,
                layers,
                setLayers,
                nextLayer,
                setNextLayer,
                modelContainer,
                setModelContainer,
                background,
                setBackground,
                text,
                setText,
                sceneSetting,
                setSceneSetting,
                guideline,
                setGuideline,
                reset,
                setReset,
                hide,
                setHide,
                hideAnnouncements,
                setHideAnnouncements,
                showExperimental: showExperimental,
                setShowExperimental: setShowExperimental,
                startingMessage,
                setStartingMessage,
            }}
        >
            {children}
        </SceneContext.Provider>
    );
};

// Load Sample Model from Static
// const [characterFolder, motionFolder] = await GetCharacterFolder(
//     initialScene["model"]
// );

// const model = await axios.get(
//     `${staticUrl}/model/${characterFolder}/${initialScene["model"]}/${initialScene["model"]}.model3.json`
// );
// const motion = await axios.get(
//     `${staticUrl}/motion/${motionFolder}/BuildMotionData.json`
// );

// const modelData = await GetModelDataFromStatic(
//     characterFolder,
//     initialScene["model"],
//     model.data,
//     motion.data
// );

// setStartingMessage("Fetching initial model from sekai-viewer...");

// Load Sample Model from sekai-viewer
// const getModel = await axios.get(
//     `${sekaiUrl}/model/${initialScene["model"].modelPath}/${initialScene["model"].modelFile}`
// );
// setStartingMessage(
//     "Fetching initial motion data from sekai-viewer..."
// );
// const [motionBaseName, motionData] = await GetMotionData(
//     initialScene["model"]
// );

// setStartingMessage("Fixing model data...");
// const modelData = await GetModelDataFromSekai(
//     initialScene["model"],
//     getModel.data,
//     motionData,
//     motionBaseName
// );

// setStartingMessage("Loading model texture...");
// await axios.get(
//     modelData.url + modelData.FileReferences.Textures[0]
// );
// setStartingMessage("Loading model moc3 file...");
// await axios.get(modelData.url + modelData.FileReferences.Moc, {
//     responseType: "arraybuffer",
// });
// setStartingMessage("Loading model physics file...");
// await axios.get(modelData.url + modelData.FileReferences.Physics);

// setStartingMessage("Putting new model...");
// const live2DModel = await Live2DModel.from(modelData, {
//     autoInteract: false,
// });
// live2DModel.scale.set(0.5);
// live2DModel.position.set(190, -280);

// modelContainer.addChildAt(live2DModel, 0);
// initApplication.stage.addChildAt(modelContainer, 2);
// setStartingMessage("Adding pose and emotion...");
// live2DModel.motion("Expression", 38);
// await new Promise((resolve) => setTimeout(resolve, 2000));
