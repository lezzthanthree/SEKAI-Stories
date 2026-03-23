import * as PIXI from "pixi.js";
import { Assets } from "@pixi/assets";

import {
    IChoicesTextSetup,
    IDialogueTextSetup,
    ISceneTextSetup,
} from "../types/ITextSceneSetup";

const textAlignmentCookie = Number(
    localStorage.getItem("textAlignment-v2") ?? 0,
);
export const SetupDialogueText = async (
    setup: IDialogueTextSetup,
    nameTag: string,
    dialogue: string,
) => {
    const textBackgroundTexture = await Assets.load(setup.bg);
    const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
    textBackgroundSprite.width = 1920;
    textBackgroundSprite.height = 1080;

    const textNameTag = new PIXI.Text(nameTag, setup.nameTag.textStyle);
    textNameTag.position.set(
        setup.nameTag.textPosition.x,
        setup.nameTag.textPosition.y + textAlignmentCookie,
    );
    console.log(setup.nameTag.textAnchor);
    textNameTag.anchor.set(
        setup.nameTag.textAnchor?.x ?? 0,
        setup.nameTag.textAnchor?.y ?? 0,
    );

    const textDialogue = new PIXI.Text(dialogue, setup.dialogue.textStyle);
    textDialogue.position.set(
        setup.dialogue.textPosition.x,
        setup.dialogue.textPosition.y + textAlignmentCookie,
    );

    const textContainer = new PIXI.Container();
    textContainer.addChildAt(textBackgroundSprite, 0);
    textContainer.addChildAt(textNameTag, 1);
    textContainer.addChildAt(textDialogue, 2);

    textContainer.visible = setup.visible;
    return { textContainer, textNameTag, textDialogue };
};
export const SetupChoicesText = async (
    setup: IChoicesTextSetup,
    choices: {
        choice1: string;
        choice2: string;
    },
) => {
    const choicesTextTexture = await Assets.load(setup.bg);
    const choicesTextSprite = new PIXI.Sprite(choicesTextTexture);
    const choicesFirstText = new PIXI.Text(
        choices.choice1,
        setup.choice1.textStyle,
    );
    choicesFirstText.anchor.set(
        setup.choice1.textAnchor!.x,
        setup.choice1.textAnchor!.y,
    );
    choicesFirstText.position.set(
        setup.choice1.textPosition.x,
        setup.choice1.textPosition.y,
    );

    const choicesSecondText = new PIXI.Text(
        choices.choice2,
        setup.choice2.textStyle,
    );
    choicesSecondText.anchor.set(
        setup.choice2.textAnchor!.x,
        setup.choice2.textAnchor!.y,
    );
    choicesSecondText.position.set(
        setup.choice2.textPosition.x,
        setup.choice2.textPosition.y,
    );

    const choicesTextContainer = new PIXI.Container();
    choicesTextContainer.addChildAt(choicesTextSprite, 0);
    choicesTextContainer.addChildAt(choicesFirstText, 1);
    choicesTextContainer.addChildAt(choicesSecondText, 2);

    choicesTextContainer.visible = setup.visible;

    return {
        choicesTextContainer,
        choicesFirstText,
        choicesSecondText,
    };
};

export const SetupSceneText = async (setup: ISceneTextSetup, scene: string) => {
    const sceneTextTexture = await Assets.load(setup.bg);
    const sceneTextSprite = new PIXI.Sprite(sceneTextTexture);
    const sceneText = new PIXI.Text(scene, setup.text.textStyle);
    sceneText.anchor.set(setup.text.textAnchor!.x, setup.text.textAnchor!.y);
    sceneText.position.set(
        setup.text.textPosition.x,
        setup.text.textPosition.y,
    );

    const sceneTextContainer = new PIXI.Container();
    sceneTextContainer.addChildAt(sceneTextSprite, 0);
    sceneTextContainer.addChildAt(sceneText, 1);

    sceneTextContainer.visible = setup.visible;

    return {
        sceneTextContainer,
        sceneText,
    };
};
