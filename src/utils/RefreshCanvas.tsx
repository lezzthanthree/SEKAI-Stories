import * as PIXI from "pixi.js";
import { Live2DModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import ISceneContextType from "../types/ISceneContextType";
import { getBackground } from "./GetBackground";

export const refreshCanvas = async (context: ISceneContextType) => {
    if (
        !context?.app ||
        !context.text ||
        !context.background ||
        !context.sceneText
    )
        return;

    const { app, setApp, text, filter, sceneText, guideline } = context;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    app.stop();

    const initApplication = new PIXI.Application({
        view: canvas,
        autoStart: true,
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
    });

    Live2DModel.registerTicker(PIXI.Ticker);
    const transparentContainer = new PIXI.Container();
    const transparentSprite = await getBackground(
        "/background_special/Background_Transparent.png"
    );

    transparentContainer.addChild(transparentSprite);

    initApplication.stage.addChildAt(transparentContainer, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (filter?.container) {
        initApplication.stage.addChildAt(filter.container, 1);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (text.textContainer) {
        initApplication.stage.addChildAt(text.textContainer, 2);
    }

    if (sceneText.sceneTextContainer) {
        initApplication.stage.addChildAt(sceneText.sceneTextContainer, 3);
    }

    if (guideline) {
        initApplication.stage.addChildAt(guideline.container, 4);
    }

    setApp(initApplication);
};
