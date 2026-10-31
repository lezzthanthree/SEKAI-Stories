import {
    IDialogueTextSetup,
    ISceneTextSetup,
    IChoicesTextSetup,
} from "../types/ITextSceneSetup";

export const dialogueBoxesSetupData: Record<string, IDialogueTextSetup> = {
    default: {
        bg: "/img/Dialogue_Background.png",
        nameTag: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-EB", "FOT-RodinNTLGPro-EB-Viet"],
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            },
            textPosition: {
                x: 225,
                y: 775,
            },
        },
        dialogue: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 44,
                fill: 0xffffff,
                stroke: 0x5d5d79,
                strokeThickness: 8,
                wordWrap: true,
                wordWrapWidth: 1300,
                breakWords: true,
                lineHeight: 55,
            },
            textPosition: {
                x: 245,
                y: 845,
            },
        },
    },
    classic: {
        bg: "/img/Dialogue_Background_Classic.png",
        nameTag: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 48,
                fill: 0xffffff,
            },
            textPosition: {
                x: 292,
                y: 745,
            },
        },
        dialogue: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 48,
                fill: 0x444466,
                wordWrap: true,
                wordWrapWidth: 1300,
                breakWords: true,
                lineHeight: 55,
            },
            textPosition: {
                x: 240,
                y: 825,
            },
        },
    },
    mySekai: {
        bg: "/img/Dialogue_Background_MYSEKAI.png",
        nameTag: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-EB", "FOT-RodinNTLGPro-EB-Viet"],
                fontSize: 44,
                fill: 0x444466,
            },
            textPosition: {
                x: 265,
                y: 745,
            },
        },
        dialogue: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 44,
                fill: 0x444466,
                wordWrap: true,
                wordWrapWidth: 1300,
                breakWords: true,
                lineHeight: 55,
            },
            textPosition: {
                x: 265,
                y: 810,
            },
        },
    },
};

export const choicesTextsSetupData: Record<string, IChoicesTextSetup> = {
    default: {
        bg: "/img/Choices_Background.png",
        choice1: {
            textString: "Choice 1",
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-EB", "FOT-RodinNTLGPro-EB-Viet"],
                fontSize: 32,
                fill: 0x444466,
                align: "center",
            },
            textPosition: {
                x: 500,
                y: 537,
            },
            textAnchor: {
                x: 0.5,
                y: 0.5,
            },
        },
        choice2: {
            textString: "Choice 2",
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-EB", "FOT-RodinNTLGPro-EB-Viet"],
                fontSize: 32,
                fill: 0x444466,
                align: "center",
            },
            textPosition: {
                x: 1420,
                y: 537,
            },
            textAnchor: {
                x: 0.5,
                y: 0.5,
            },
        },
    },
    classic: {
        bg: "/img/Choices_Background_Classic.png",
        choice1: {
            textString: "Choice 1",
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 40,
                fill: 0x444466,
                align: "center",
            },
            textPosition: {
                x: 437,
                y: 539,
            },
            textAnchor: {
                x: 0.5,
                y: 0.5,
            },
        },
        choice2: {
            textString: "Choice 2",
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 40,
                fill: 0x444466,
                align: "center",
            },
            textPosition: {
                x: 1485,
                y: 539,
            },
            textAnchor: {
                x: 0.5,
                y: 0.5,
            },
        },
    },
};

export const sceneCenterTextsSetupData: Record<string, ISceneTextSetup> = {
    default: {
        bg: "/img/SceneText_Background.png",
        text: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 44,
                fill: 0xffffff,
                align: "center",
            },
            textPosition: {
                x: 960,
                y: 540,
            },
            textAnchor: {
                x: 0.5,
                y: 0.5,
            },
        },
    },
    classic: {
        bg: "/img/SceneText_Background_Classic.png",
        text: {
            textStyle: {
                fontFamily: ["FOT-RodinNTLGPro-DB", "FOT-RodinNTLGPro-DB-Viet"],
                fontSize: 40,
                fill: 0xffffff,
                align: "center",
            },
            textPosition: {
                x: 960,
                y: 540,
            },
            textAnchor: {
                x: 0.5,
                y: 0.5,
            },
        },
    },
};

export const sceneTopLeftTexts: Record<string, ISceneTextSetup> = {
    default: {
        bg: "/img/SceneText_TopLeft.png",
        text: {
            textStyle: {
                fontFamily: "FOT-RodinNTLGPro-DB",
                fontSize: 39,
                fill: 0xffffff,
                align: "center",
            },
            textPosition: {
                x: 120,
                y: 62,
            },
            textAnchor: {
                x: 0,
                y: 0.5,
            },
        },
    },
    classic: {
        bg: "/img/SceneText_TopLeft_Classic.png",
        text: {
            textStyle: {
                fontFamily: "FOT-RodinNTLGPro-DB",
                fontSize: 32,
                fill: 0xffffff,
                align: "center",
            },
            textPosition: {
                x: 62,
                y: 76,
            },
            textAnchor: {
                x: 0,
                y: 0.5,
            },
        },
    },
};
