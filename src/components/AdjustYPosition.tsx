import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import Window from "./UI/Window";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../contexts/SceneContext";
import * as PIXI from "pixi.js";

interface AdjustYPositionProps {
    show: Dispatch<SetStateAction<boolean>>;
    confirmFunction?: () => void;
    inTutorial?: boolean;
}

const randomMessage = [
    "Just Mizuki.",
    "Lorem ipsum dolor.",
    "Kanade's Ramen.",
    "Kitto todoku hazu.",
    "Sample message.",
    "missingno.",
    "mizukey",
    "SIFAS died for this.",
];

const AdjustYPosition: React.FC<AdjustYPositionProps> = ({
    show,
    confirmFunction,
    inTutorial = false,
}) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not found");
    const { text, setText } = scene;
    const [textContainer, setTextContainer] = useState<PIXI.Container | null>(
        null
    );
    const [yOffset, setYOffset] = useState<number>(text?.yOffset ?? 0);
    const offsetCanvas = useRef<HTMLCanvasElement | null>(null);
    const message =
        randomMessage[Math.floor(Math.random() * randomMessage.length)];
    useEffect(() => {
        const render = async () => {
            console.log("Initial Setup Started");
            const initApplication = new PIXI.Application({
                view: offsetCanvas.current as HTMLCanvasElement,
                autoStart: true,
                width: 660,
                height: 250,
                backgroundColor: 0x000000,
            });
            const testContainer = new PIXI.Container();
            const testTexture = await PIXI.Texture.fromURL(
                "/img/canvas-test.png"
            );
            const testSprite = new PIXI.Sprite(testTexture);
            testContainer.addChild(testSprite);
            initApplication.stage.addChildAt(testContainer, 0);

            const textContainer = new PIXI.Container();
            const textNameTag = new PIXI.Text("Align me here!", {
                fontFamily: "FOT-RodinNTLGPro-EB",
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            });
            textNameTag.position.set(46, 49);
            const textDialogue = new PIXI.Text(message, {
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
            textDialogue.position.set(67, 119);

            textContainer.addChildAt(textNameTag, 0);
            textContainer.addChildAt(textDialogue, 1);
            textContainer.y = 0 + yOffset;
            setTextContainer(textContainer);

            initApplication.stage.addChildAt(textContainer, 1);
        };
        render();
    }, []);

    const handleYOffsetChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number(event.target.value);
        localStorage.setItem("textAlignment-v2", String(value));

        if (textContainer) {
            textContainer.y = 0 + value;
        }
        if (text) {
            text.nameTag.y = 775 + value;
            text.dialogue.y = 845 + value;
            setText({
                ...text,
                yOffset: value,
            });
        }
        setYOffset(value);
    };
    return (
        <Window
            show={show}
            confirmLabel={inTutorial ? t("next") : t("close")}
            confirmFunction={confirmFunction}
            skipCloseInConfirm={inTutorial}
            hideClose={inTutorial}
            className="window__90_width"
        >
            <div className="window__content">
                <h1>{t("text.y-offset")}</h1>
                <p>{t("tutorial.initialSetup1")}</p>
                <p>{t("tutorial.initialSetup2")}</p>
                <canvas
                    height={250}
                    width={660}
                    ref={offsetCanvas}
                    id="canvas-test"
                />
                <input
                    type="range"
                    min="-20"
                    max="20"
                    value={yOffset}
                    onChange={handleYOffsetChange}
                />
            </div>
        </Window>
    );
};

export default AdjustYPosition;
