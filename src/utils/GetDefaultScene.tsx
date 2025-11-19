import * as PIXI from "pixi.js";
import { getBackground } from "../utils/GetBackground";
import { Live2DModel } from "pixi-live2d-display-mulmotion";
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

interface GetDefaultSceneProps {
    app: PIXI.Application | undefined;
    setStartingMessage: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<number>>;
    scene?: string;
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
    sceneText: string;
}

const randomInitialScene: InitialScene[] = [
    {
        background: "/background_special/Background_Uranohoshi_Rooftop.jpg",
        model: "07airi_qtnormal",
        text: "I'm ○○○-sama's little demon number four...\nM-Momoi Airi...",
        nameTag: "Airi",
        character: "airi",
        modelX: 960,
        modelY: 590,
        pngName: "airi_littledemon",
        sceneText: "Uranohoshi High School Rooftop",
    },
    {
        background: "/background_compressed/bg_a001101.jpg",
        model: "v2_19ena_casual",
        text: "Mizuki, that's not how you break a KitKat!",
        nameTag: "Ena",
        character: "ena",
        modelX: 960,
        modelY: 630,
        pngName: "ena",
        sceneText: "Diner",
    },
    {
        background: "/background_compressed/bg_a000702.jpg",
        model: "v2_19ena_casual",
        text: "MIZUKI, NO.",
        nameTag: "Ena",
        character: "ena",
        modelX: 960,
        modelY: 700,
        pngName: "mizuki-nui",
        sceneText: "Kamiyama High School - Rooftop",
    },
    {
        background: "/background_special/Background_Nijigasaki.jpg",
        model: "v2_17kanade_casual",
        text: "A-am I doing it right?",
        nameTag: "Kanade",
        character: "kanade",
        modelX: 960,
        modelY: 630,
        pngName: "kanade-idol",
        sceneText: "Nijigasaki School Idol Club",
    },
    {
        background: "/background_compressed/bg_a001801.jpg",
        model: "04shiho_cloth01",
        text: "...",
        nameTag: "Shiho",
        character: "shiho",
        modelX: 960,
        modelY: 610,
        pngName: "shiho",
        sceneText: "Music Shop",
    },
];

const randomOctoberScene: InitialScene[] = [
    {
        background: "/background_special/Background_Cheat_to_Happiness.jpg",
        model: "18mafuyu_cloth001",
        text: "→↓↑→→↓→→↑↑↓↓←→←→",
        nameTag: "Mafuyu",
        character: "mafuyu",
        modelX: 960,
        modelY: 545,
        pngName: "mafuyu_oct",
        sceneText: "Mafuyu's Room",
    },
    {
        background: "/background_special/Background_Cheat_to_Happiness_2.png",
        model: "18mafuyu_cloth001",
        text: "If you've entered the secret code properly up to this point, perhaps you'll take on a happier form?",
        nameTag: "(Translation)",
        character: "custom",
        modelX: 960,
        modelY: 545,
        pngName: "transparent",
        sceneText: "???",
    },
    {
        background: "/background_special/Background_BIRDBRAIN.jpg",
        model: "20mizuki_normal",
        text: "#$%@!",
        nameTag: "Mizuki",
        character: "mizuki",
        modelX: 960,
        modelY: 540,
        pngName: "mizuki_birdbrain",
        sceneText: "???",
    },
    {
        background: "/background_special/Background_Kisaragi.png",
        model: "20mizuki_normal",
        text: "",
        nameTag: "",
        character: "blank",
        modelX: 1000,
        modelY: 640,
        pngName: "mizuki_kisaragi",
        sceneText: "",
    },
    {
        background: "/background_special/Background_Nemui.png",
        model: "19ena_jc",
        text: "Let's take some medicine and go to bed!",
        nameTag: "Ena",
        character: "ena",
        modelX: 960,
        modelY: 540,
        pngName: "ena_nemui",
        sceneText: "???",
    },
    {
        background: "/background_special/Background_Ame.jpg",
        model: "19ena_cloth001",
        text: "... where the hell am I?!",
        nameTag: "Ena",
        character: "ena",
        modelX: 960,
        modelY: 605,
        pngName: "ena_kangel",
        sceneText: "???",
    },
    {
        background: "/background_special/Background_Exit8.png",
        model: "v2_17kanade_casual",
        text: "...!",
        nameTag: "Kanade",
        character: "custom",
        modelX: 960,
        modelY: 540,
        pngName: "k_parents",
        sceneText: "???",
    },
    {
        background: "/background_compressed/bg_a002301.jpg",
        model: "01ichika_cloth001",
        text: "Ah, wrong series!",
        nameTag: "???",
        character: "custom",
        modelX: 960,
        modelY: 570,
        pngName: "setsuna",
        sceneText: "Scramble Crossing",
    },
    {
        background: "/background_special/Background_Perfect.jpg",
        model: "v2_05minori_unit",
        text: "(Everything that I can say is spoken for me.)",
        nameTag: "Minori",
        character: "minori",
        modelX: 960,
        modelY: 545,
        pngName: "minori_spoken_for",
        sceneText: "Stage",
    },
    {
        background: "/background_compressed/bg_a003003.jpg",
        model: "14emu_cloth001",
        text: "Jumpscare Wonderhoy!",
        nameTag: "Emu",
        character: "emu",
        modelX: 960,
        modelY: 545,
        pngName: "emu_jumpscare",
        sceneText: "Emu's Room",
    },
    {
        background: "/background_special/Background_Akarin.jpg",
        model: "14emu_normal",
        text: "Haiii～!",
        nameTag: "Emu",
        character: "emu",
        modelX: 960,
        modelY: 540,
        pngName: "emu_channnnn",
        sceneText: "???",
    },
];

const personaScenes: InitialScene[] = [
    {
        background: "/background_special/Background_Other_Kamiyama.png",
        model: "20mizuki_normal",
        text: "I am a shadow of your true inner self.",
        nameTag: "Mizuki?",
        character: "custom",
        modelX: 960,
        modelY: 545,
        pngName: "mizuki_shadow",
        sceneText: "Kamiyama High School Rooftop?",
    },
    {
        background: "/background_special/Background_Mizuki's_Room_(Abyss).png",
        model: "20mizuki_normal",
        text: "Hmm... MiraMagi just hit me so hard...",
        nameTag: "Mizuki",
        character: "custom",
        modelX: 960,
        modelY: 545,
        pngName: "mizuki_p3",
        sceneText: "Mizuki's Room",
    },
];

const LoadInitialScene = (scene?: string): InitialScene => {
    if (scene === "blank") {
        return {
            background: "/background_compressed/bg_white.jpg",
            model: "01ichika_cloth001",
            text: "<insert text here>",
            nameTag: "<name>",
            character: "custom",
            modelX: 960,
            modelY: 550,
            pngName: "blank",
            sceneText: "<white>",
        };
    }

    if (scene === "blankoctober") {
        return {
            background: "/background_compressed/bg_white.jpg",
            model: "01ichika_cloth001",
            text: "<oooo spooky month>",
            nameTag: "<name>",
            character: "custom",
            modelX: 960,
            modelY: 550,
            pngName: "blankoctober",
            sceneText: "<white>",
        };
    }

    if (scene === "getjumped") {
        return {
            background: "/background_compressed/bg00026.jpg",
            model: "v2_20mizuki_casual",
            text: "a lot of you guys use this site whose owner is a huge ruinene fan but there are 14k of you every week and i don't wanna get jumped.",
            nameTag: "Mizuki",
            character: "mizuki",
            modelX: 940,
            modelY: 550,
            pngName: "mizuki_lookaway",
            sceneText: "white",
        };
    }

    if (scene === "october") {
        return randomOctoberScene[
            Math.floor(Math.random() * randomOctoberScene.length)
        ];
    }

    if (scene === "pmizu5") {
        return personaScenes[Math.floor(Math.random() * personaScenes.length)];
    }

    return randomInitialScene[
        Math.floor(Math.random() * randomInitialScene.length)
    ];
};

const firstSplitBackgroundFilename = "/background_compressed/bg_e000303.jpg";
const secondSplitBackgroundFilename = "/background_compressed/bg_e000403.jpg";

const LoadBackground = async (
    container: PIXI.Container,
    childAt: number,
    fileName: string
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
    childAt: number
): Promise<ISplitBackground> => {
    const splitBackgroundContainer = new PIXI.Container();
    const firstBackground = new PIXI.Container();
    const firstBackgroundSprite = await getBackground(
        firstSplitBackgroundFilename
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
        secondSplitBackgroundFilename
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
    character: string,
    model: string,
    x: number,
    y: number
): Promise<{
    model: Record<string, IModel>;
    modelWrapper: PIXI.Container;
    lighting: ILighting;
}> => {
    const modelWrapper = new PIXI.Container();
    const modelContainer = new PIXI.Container();
    const texture = await PIXI.Texture.fromURL(`/img/${file}.png`);
    const sprite = new PIXI.Sprite(texture);
    modelContainer.addChildAt(sprite, 0);
    modelWrapper.addChildAt(modelContainer, 0);
    modelContainer.pivot.set(
        modelContainer.width / 2,
        modelContainer.height / 2
    );
    modelContainer.position.set(x, y);
    const lighting: ILighting = {
        red: 1,
        green: 1,
        blue: 1,
        saturation: 1,
        brightness: 1,
    };
    const adjustmentFilter = new AdjustmentFilter(lighting);
    modelWrapper.filters = [adjustmentFilter];

    container.addChildAt(modelWrapper, childAt);
    return {
        model: {
            character1: {
                character: character,
                root: modelContainer,
                model: sprite,
                modelName: model,
                modelX: modelContainer.x,
                modelY: modelContainer.y,
                modelScale: modelContainer.scale.x,
                modelRotation: 0,
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
    dialogue: string
): Promise<IText> => {
    const textAlignmentCookie = Number(
        localStorage.getItem("textAlignment-v2") ?? 0
    );

    const textContainer = new PIXI.Container();
    const textBackgroundTexture = await Assets.load(
        "/img/Dialogue_Background.png"
    );
    const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
    textBackgroundSprite.width = 1920;
    textBackgroundSprite.height = 1080;

    const textNameTag = new PIXI.Text(nameTag, {
        fontFamily: "FOT-RodinNTLGPro-EB",
        fontSize: 44,
        fill: 0xebebef,
        stroke: 0x5d5d79,
        strokeThickness: 8,
    });
    textNameTag.position.set(225, 775 + textAlignmentCookie);

    const textDialogue = new PIXI.Text(dialogue, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 44,
        fill: 0xffffff,
        stroke: 0x5d5d79,
        strokeThickness: 8,
        wordWrap: true,
        wordWrapWidth: 1300,
        breakWords: true,
        lineHeight: 55,
    });
    textDialogue.position.set(245, 845 + textAlignmentCookie);

    textContainer.addChildAt(textBackgroundSprite, 0);
    textContainer.addChildAt(textNameTag, 1);
    textContainer.addChildAt(textDialogue, 2);

    app.stage.addChildAt(textContainer, childAt);

    return {
        textContainer: textContainer,
        nameTag: textNameTag,
        dialogue: textDialogue,
        nameTagString: nameTag,
        dialogueString: dialogue,
        fontSize: 44,
        visible: true,
        yOffset: textAlignmentCookie,
        hideEverything: false,
    };
};

const LoadSceneText = async (
    app: PIXI.Application,
    childAt: number,
    scene: string
): Promise<ISceneText> => {
    const sceneTextContainer = new PIXI.Container();

    // Middle Texture
    const sceneTextMiddleTexture = await Assets.load(
        "/img/SceneText_Background.png"
    );
    const sceneTextMiddleSprite = new PIXI.Sprite(sceneTextMiddleTexture);
    const sceneTextMiddle = new PIXI.Text(scene, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 44,
        fill: 0xffffff,
        align: "center",
    });
    sceneTextMiddle.anchor.set(0.5, 0.5);
    sceneTextMiddle.position.set(960, 540);

    const sceneTextMiddleContainer = new PIXI.Container();
    sceneTextMiddleContainer.addChildAt(sceneTextMiddleSprite, 0);
    sceneTextMiddleContainer.addChildAt(sceneTextMiddle, 1);

    // Top-left Texture
    const sceneTextTopLeftTexture = await Assets.load(
        "/img/SceneText_TopLeft.png"
    );
    const sceneTextTopLeftSprite = new PIXI.Sprite(sceneTextTopLeftTexture);
    const sceneTextTopLeft = new PIXI.Text(scene, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 39,
        fill: 0xffffff,
        align: "center",
    });
    sceneTextTopLeft.anchor.set(0, 0.5);
    sceneTextTopLeft.position.set(120, 62);

    const sceneTextTopLeftContainer = new PIXI.Container();
    sceneTextTopLeftContainer.addChildAt(sceneTextTopLeftSprite, 0);
    sceneTextTopLeftContainer.addChildAt(sceneTextTopLeft, 1);
    sceneTextTopLeftContainer.visible = false;

    sceneTextContainer.addChildAt(sceneTextMiddleContainer, 0);
    sceneTextContainer.addChildAt(sceneTextTopLeftContainer, 1);

    app.stage.addChildAt(sceneTextContainer, childAt);

    sceneTextContainer.visible = false;

    return {
        sceneTextContainer: sceneTextContainer,
        middle: sceneTextMiddleContainer,
        topLeft: sceneTextTopLeftContainer,
        text: [sceneTextMiddle, sceneTextTopLeft],
        textString: scene,
        visible: false,
        variant: "middle",
    };
};

const LoadGuideline = async (
    app: PIXI.Application,
    childAt: number
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

export const LoadScene = async ({
    app,
    setStartingMessage,
    setLoading,
    scene,
}: GetDefaultSceneProps) => {
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
    // Load Transparent (for development. idk why it causes issues before production)
    const transparentContainer = new PIXI.Container();
    const transparentSprite = await getBackground(
        "/background_special/Background_Transparent.png"
    );
    transparentContainer.addChildAt(transparentSprite, 0);
    initApplication.stage.addChildAt(transparentContainer, 0);

    setLoading(30);
    // Load Filter Container
    const filterContainer = new PIXI.Container();
    initApplication.stage.addChildAt(filterContainer, 1);
    const filter: IFilter = { container: filterContainer };

    setLoading(40);
    // Load Background
    setStartingMessage("Adding background...");
    const background = await LoadBackground(
        filterContainer,
        0,
        initialScene["background"]
    );

    setLoading(50);
    // Load Split Background
    const splitBackground = await LoadSplitBackground(filterContainer, 1);

    setLoading(60);
    // Load Sample PNG Sprite
    const { model, modelWrapper, lighting } = await LoadModel(
        filterContainer,
        2,
        initialScene.pngName,
        initialScene.character,
        initialScene.model,
        initialScene.modelX,
        initialScene.modelY
    );

    setLoading(70);
    // Load Text
    setStartingMessage("Adding text...");
    const text = await LoadText(
        initApplication,
        2,
        initialScene.nameTag,
        initialScene.text
    );

    setLoading(80);
    // Load Scene Setting Text
    const sceneText = await LoadSceneText(
        initApplication,
        3,
        initialScene.sceneText
    );

    setLoading(90);
    // Load Guideline Tools
    const guideline = await LoadGuideline(initApplication, 4);

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
        sceneText: sceneText,
        filter: filter,
        guideline: guideline,
    };
};
