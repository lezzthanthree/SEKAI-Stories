import * as PIXI from "pixi.js";
import { getBackground } from "../utils/GetBackground";
import { Live2DModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import { Dispatch, SetStateAction } from "react";
import { Assets } from "@pixi/assets";
import IBackground from "../types/IBackground";
import { ISplitBackground } from "../types/ISplitBackground";
import IText from "../types/IText";
import ISceneText from "../types/ISceneText";
import IGuideline from "../types/IGuideline";
import IModel from "../types/IModel";
import { IFilter } from "../types/IFilter";
import { AdjustmentFilter } from "pixi-filters";
import { ILighting } from "../types/ILighting";
import { InitialScene } from "../types/IInitialScene";
import { CheckSceneCategory, randomInitialScene } from "../data/Scenes";
import IChoicesText from "../types/IChoicesText";
import {
    SetupChoicesText,
    SetupDialogueText,
    SetupSceneText,
} from "./TextSceneSetupHelper";
import {
    choicesTextsSetupData,
    dialogueBoxesSetupData,
    sceneCenterTextsSetupData,
    sceneTopLeftTexts,
} from "../data/TextSetups";
import { ILoopingTheRooms } from "../types/ILoopingTheRooms";

interface GetDefaultSceneProps {
    app: PIXI.Application | undefined;
    setStartingMessage: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<number>>;
    blankCanvas: boolean;
    sceneSelected?: string | null;
}

const LoadInitialScene = (scene: string): InitialScene => {
    return randomInitialScene[scene][
        Math.floor(Math.random() * randomInitialScene[scene].length)
    ];
};

const firstSplitBackgroundFilename = "/background_compressed/bg_e000303.jpg";
const secondSplitBackgroundFilename = "/background_compressed/bg_e000403.jpg";

const LoadBackground = async (
    container: PIXI.Container,
    childAt: number,
    fileName: string,
): Promise<IBackground> => {
    const backgroundContainer = new PIXI.Container();
    const backgroundSprite = await getBackground(fileName);
    backgroundContainer.addChild(backgroundSprite);
    container.addChildAt(backgroundContainer, childAt);

    return {
        backgroundContainer: backgroundContainer,
        filename: fileName,
        upload: false,
    };
};

const LoadSplitBackground = async (
    container: PIXI.Container,
    childAt: number,
): Promise<ISplitBackground> => {
    const splitBackgroundContainer = new PIXI.Container();
    const firstBackground = new PIXI.Container();
    const firstBackgroundSprite = await getBackground(
        firstSplitBackgroundFilename,
    );
    const firstMask = new PIXI.Graphics();
    firstMask.beginFill();
    firstMask.moveTo(0, 0);
    firstMask.lineTo(985, 0);
    firstMask.lineTo(905, 1080);
    firstMask.lineTo(0, 1080);
    firstMask.endFill();
    firstBackground.mask = firstMask;
    firstBackground.addChild(firstBackgroundSprite);
    const secondBackground = new PIXI.Container();
    const secondBackgroundSprite = await getBackground(
        secondSplitBackgroundFilename,
    );
    const secondMask = new PIXI.Graphics();
    secondMask.beginFill();
    secondMask.moveTo(1920, 0);
    secondMask.lineTo(1005, 0);
    secondMask.lineTo(925, 1080);
    secondMask.lineTo(1920, 1080);
    secondMask.endFill();
    secondBackground.mask = secondMask;
    secondBackground.addChild(secondBackgroundSprite);
    const line = new PIXI.Graphics();
    line.beginFill(0xffffff);
    line.moveTo(985, 0);
    line.lineTo(1005, 0);
    line.lineTo(925, 1080);
    line.lineTo(905, 1080);
    line.endFill();
    splitBackgroundContainer.addChildAt(firstBackground, 0);
    splitBackgroundContainer.addChildAt(secondBackground, 1);
    splitBackgroundContainer.addChildAt(line, 2);
    container.addChildAt(splitBackgroundContainer, childAt);
    splitBackgroundContainer.visible = false;

    return {
        splitContainer: splitBackgroundContainer,
        first: {
            backgroundContainer: firstBackground,
            filename: firstSplitBackgroundFilename,
            upload: false,
        },
        second: {
            backgroundContainer: secondBackground,
            filename: secondSplitBackgroundFilename,
            upload: false,
        },
        visible: false,
    };
};

const LoadModel = async (
    container: PIXI.Container,
    childAt: number,
    file: string,
    x: number,
    y: number,
    scale?: number,
): Promise<{
    model: Record<string, IModel>;
    modelWrapper: PIXI.Container;
    lighting: ILighting;
}> => {
    const modelWrapper = new PIXI.Container();
    const modelContainer = new PIXI.Container();
    const texture = await PIXI.Texture.fromURL(`/img/characters/${file}.png`);
    const sprite = new PIXI.Sprite(texture);
    modelContainer.addChildAt(sprite, 0);
    modelWrapper.addChildAt(modelContainer, 0);
    modelContainer.pivot.set(
        modelContainer.width / 2,
        modelContainer.height / 2,
    );
    modelContainer.position.set(x, y);
    modelContainer.scale.set(scale, scale);
    const lighting: ILighting = {
        red: 1,
        green: 1,
        blue: 1,
        saturation: 1,
        brightness: 1,
    };
    const adjustmentFilter = new AdjustmentFilter(lighting);
    modelWrapper.filters = [adjustmentFilter];

    const blurFilter = new PIXI.BlurFilter(0);
    modelContainer.filters = [blurFilter];

    container.addChildAt(modelWrapper, childAt);
    return {
        model: {
            character1: {
                character: "custom",
                root: modelContainer,
                model: sprite,
                modelName: file,
                modelX: modelContainer.x,
                modelY: modelContainer.y,
                modelScale: modelContainer.scale.x,
                modelRotation: 0,
                modelBlur: 0,
                modelData: undefined,
                virtualEffect: false,
                expression: 0,
                pose: 0,
                idle: true,
                visible: true,
                from: "sekai",
                parametersChanged: {},
            },
        },
        modelWrapper: modelWrapper,
        lighting: lighting,
    };
};

const LoadText = async (
    app: PIXI.Application,
    childAt: number,
    nameTag: string,
    dialogue: string,
): Promise<IText> => {
    const textAlignmentCookie = Number(
        localStorage.getItem("textAlignment-v2") ?? 0,
    );

    const textContainer = new PIXI.Container();

    const {
        textContainer: defaultTextContainer,
        textDialogue: defaultTextDialogue,
        textNameTag: defaultTextNameTag,
    } = await SetupDialogueText(
        dialogueBoxesSetupData.default,
        nameTag,
        dialogue,
    );
    const {
        textContainer: classicTextContainer,
        textDialogue: classicTextDialogue,
        textNameTag: classicTextNameTag,
    } = await SetupDialogueText(
        dialogueBoxesSetupData.classic,
        nameTag,
        dialogue,
    );
    const {
        textContainer: mySekaiTextContainer,
        textDialogue: mySekaiTextDialogue,
        textNameTag: mySekaiTextNameTag,
    } = await SetupDialogueText(
        dialogueBoxesSetupData.mySekai,
        nameTag,
        dialogue,
    );
    const {
        textContainer: ddlcTextContainer,
        textDialogue: ddlcTextDialogue,
        textNameTag: ddlcTextNameTag,
    } = await SetupDialogueText(dialogueBoxesSetupData.ddlc, nameTag, dialogue);

    textContainer.addChildAt(defaultTextContainer, 0);
    textContainer.addChildAt(classicTextContainer, 1);
    textContainer.addChildAt(mySekaiTextContainer, 2);
    textContainer.addChildAt(ddlcTextContainer, 3);

    app.stage.addChildAt(textContainer, childAt);

    return {
        textContainer: textContainer,
        type: {
            default: defaultTextContainer,
            classic: classicTextContainer,
            mySekai: mySekaiTextContainer,
            ddlc: ddlcTextContainer,
        },
        nameTag: [
            defaultTextNameTag,
            classicTextNameTag,
            mySekaiTextNameTag,
            ddlcTextNameTag,
        ],
        dialogue: [
            defaultTextDialogue,
            classicTextDialogue,
            mySekaiTextDialogue,
            ddlcTextDialogue,
        ],
        nameTagString: nameTag,
        dialogueString: dialogue,
        fontSize: 44,
        visible: true,
        yOffset: textAlignmentCookie,
        hideEverything: false,
        typeSelected: "default",
    };
};

const LoadChoicesText = async (
    app: PIXI.Application,
    childAt: number,
    enabled: boolean,
    choices: {
        choice1: string;
        choice2: string;
    },
): Promise<IChoicesText> => {
    const choicesTextContainer = new PIXI.Container();

    const {
        choicesTextContainer: defaultChoicesTextContainer,
        choicesFirstText: defaultChoicesFirstText,
        choicesSecondText: defaultChoicesSecondText,
    } = await SetupChoicesText(choicesTextsSetupData.default, choices);
    const {
        choicesTextContainer: classicChoicesTextContainer,
        choicesFirstText: classicChoicesFirstText,
        choicesSecondText: classicChoicesSecondText,
    } = await SetupChoicesText(choicesTextsSetupData.classic, choices);

    choicesTextContainer.addChildAt(defaultChoicesTextContainer, 0);
    choicesTextContainer.addChildAt(classicChoicesTextContainer, 1);

    app.stage.addChildAt(choicesTextContainer, childAt);
    choicesTextContainer.visible = enabled;

    return {
        choicesTextContainer,
        type: {
            default: defaultChoicesTextContainer,
            classic: classicChoicesTextContainer,
        },
        firstChoiceText: [defaultChoicesFirstText, classicChoicesFirstText],
        secondChoiceText: [defaultChoicesSecondText, classicChoicesSecondText],
        firstChoiceTextString: choices.choice1,
        secondChoiceTextString: choices.choice2,
        typeSelected: "default",
        visible: enabled,
    };
};

const LoadSceneText = async (
    app: PIXI.Application,
    childAt: number,
    scene: string,
): Promise<ISceneText> => {
    const sceneTextContainer = new PIXI.Container();

    const {
        sceneText: defaultSceneTextMiddle,
        sceneTextContainer: defaultSceneTextMiddleContainer,
    } = await SetupSceneText(sceneCenterTextsSetupData.default, scene);
    const {
        sceneText: classicSceneTextMiddle,
        sceneTextContainer: classicSceneTextMiddleContainer,
    } = await SetupSceneText(sceneCenterTextsSetupData.classic, scene);
    const {
        sceneText: defaultSceneTextTopLeft,
        sceneTextContainer: defaultSceneTextTopLeftContainer,
    } = await SetupSceneText(sceneTopLeftTexts.default, scene);
    const {
        sceneText: classicSceneTextTopLeft,
        sceneTextContainer: classicSceneTextTopLeftContainer,
    } = await SetupSceneText(sceneTopLeftTexts.classic, scene);

    const defaultSceneTextBox = new PIXI.Container();
    defaultSceneTextBox.addChildAt(defaultSceneTextMiddleContainer, 0);
    defaultSceneTextBox.addChildAt(defaultSceneTextTopLeftContainer, 1);

    const classicSceneTextBox = new PIXI.Container();
    classicSceneTextBox.addChildAt(classicSceneTextMiddleContainer, 0);
    classicSceneTextBox.addChildAt(classicSceneTextTopLeftContainer, 1);
    classicSceneTextBox.visible = false;

    sceneTextContainer.addChildAt(defaultSceneTextBox, 0);
    sceneTextContainer.addChildAt(classicSceneTextBox, 1);

    app.stage.addChildAt(sceneTextContainer, childAt);

    sceneTextContainer.visible = false;

    return {
        sceneTextContainer: sceneTextContainer,
        type: {
            default: defaultSceneTextBox,
            classic: classicSceneTextBox,
        },
        variant: {
            middle: [
                defaultSceneTextMiddleContainer,
                classicSceneTextMiddleContainer,
            ],
            topLeft: [
                defaultSceneTextTopLeftContainer,
                classicSceneTextTopLeftContainer,
            ],
        },
        text: [
            defaultSceneTextMiddle,
            defaultSceneTextTopLeft,
            classicSceneTextMiddle,
            classicSceneTextTopLeft,
        ],
        textString: scene,
        visible: false,
        typeSelected: "default",
        variantSelected: "middle",
    };
};

const LoadGuideline = async (
    app: PIXI.Application,
    childAt: number,
): Promise<IGuideline> => {
    const guidelineContainer = new PIXI.Container();
    const gridTexture = await Assets.load("/img/grid.png");
    const gridSprite = new PIXI.Sprite(gridTexture);
    guidelineContainer.addChild(gridSprite);
    guidelineContainer.visible = false;
    guidelineContainer.alpha = 0.2;
    app.stage.addChildAt(guidelineContainer, childAt);

    return {
        container: guidelineContainer,
        visible: false,
    };
};

const LoadLoopingTheRooms = async (
    app: PIXI.Application,
    childAt: number,
): Promise<ILoopingTheRooms> => {
    const loopingContainer = new PIXI.Container();
    const sprites: PIXI.Sprite[] = [];
    const textures = [
        "/img/loop/loop_1.png",
        "/img/loop/loop_2.png",
        "/img/loop/loop_3.png",
        "/img/loop/loop_4.png",
        "/img/loop/loop_5.png",
        "/img/loop/loop_6.png",
        "/img/loop/loop_7.png",
        "/img/loop/loop_8.png",
    ];

    textures.forEach(async (texture) => {
        const assetTexture = await Assets.load(texture);
        const sprite = new PIXI.Sprite(assetTexture);
        sprite.visible = false;
        sprites.push(sprite);
        loopingContainer.addChild(sprite);
    });

    app.stage.addChildAt(loopingContainer, childAt);

    return {
        container: loopingContainer,
        sprites: sprites,
        visible: false,
    };
};

export const LoadScene = async ({
    app,
    setStartingMessage,
    setLoading,
    blankCanvas,
    sceneSelected,
}: GetDefaultSceneProps) => {
    const scene = CheckSceneCategory(blankCanvas, sceneSelected);

    setLoading(0);
    const initialScene: InitialScene = LoadInitialScene(scene);

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (app) {
        app.stop();
    }

    setLoading(10);
    const initApplication = new PIXI.Application({
        view: canvas,
        autoStart: true,
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
    });

    Live2DModel.registerTicker(PIXI.Ticker);

    setLoading(20);
    // Load Filter Container
    const filterContainer = new PIXI.Container();
    filterContainer.pivot.set(1920 / 2, 1080 / 2);
    filterContainer.position.set(1920 / 2, 1080 / 2);
    filterContainer.scale.set(1, 1);
    initApplication.stage.addChildAt(filterContainer, 0);
    const filter: IFilter = { container: filterContainer };

    setLoading(30);
    // Load Background
    setStartingMessage("Adding background...");
    const background = await LoadBackground(
        filterContainer,
        0,
        initialScene["background"],
    );

    setLoading(40);
    // Load Split Background
    setStartingMessage("Adding split background...");
    const splitBackground = await LoadSplitBackground(filterContainer, 1);

    setLoading(50);
    // Load Sample PNG Sprite
    setStartingMessage("Adding sample model...");
    const { model, modelWrapper, lighting } = await LoadModel(
        filterContainer,
        2,
        initialScene.pngName,
        initialScene.modelX,
        initialScene.modelY,
        initialScene.modelScale ?? 1,
    );

    setLoading(60);
    // Load Text
    setStartingMessage("Adding dialogue text...");
    const text = await LoadText(
        initApplication,
        1,
        initialScene.nameTag,
        initialScene.text,
    );

    // Load Choices Text
    setLoading(70);
    setStartingMessage("Adding choices text...");
    const choicesText = await LoadChoicesText(
        initApplication,
        2,
        initialScene.choicesEnabled ?? false,
        initialScene.choices ?? { choice1: "Choice 1", choice2: "Choice 2" },
    );

    // Load Scene Setting Text
    setLoading(80);
    setStartingMessage("Adding scene text...");
    const sceneText = await LoadSceneText(
        initApplication,
        3,
        initialScene.sceneText,
    );

    setLoading(90);
    // Load Guideline Tools
    setStartingMessage("Adding guidelines...");
    const guideline = await LoadGuideline(initApplication, 4);

    setStartingMessage("Adding special event...");
    const loopingTheRooms = await LoadLoopingTheRooms(initApplication, 5);

    setLoading(100);
    return {
        app: initApplication,
        model: model,
        currentKey: "character1",
        currentModel: model["character1"],
        modelWrapper: modelWrapper,
        lighting: lighting,
        background: background,
        splitBackground: splitBackground,
        text: text,
        choicesText: choicesText,
        sceneText: sceneText,
        filter: filter,
        guideline: guideline,
        loopingTheRooms: loopingTheRooms,
    };
};
