import React, { useContext, useEffect, useState } from "react";
import Canvas from "./Canvas";
import SidebarSelect from "./SidebarSelect";
import DownloadButton from "../ButtonWindow/DownloadButton";
import { SceneContext } from "../../contexts/SceneContext";
import FlavorText from "./FlavorText";
import SettingsButton from "../ButtonWindow/SettingsButton";
import { SettingsContext } from "../../contexts/SettingsContext";
import Tutorial from "../Window/Tutorial";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import SoftError from "../UI/SoftError";
import ExportButton from "../ButtonWindow/ExportButton";
import ClearButton from "../ButtonWindow/ClearButton";
import ContentBackground from "./ContentBackground";
import { getBackground } from "../../utils/GetBackground";

const sidebarMenu = ["background", "text", "model"];
const textMenu = [
    "name-tag",
    "dialogue",
    "scene-text",
    "choices-text",
    "y-offset",
];
const modelMenu = [
    "select-layer",
    "character",
    "costume",
    "emotion",
    "transform",
    "mouth",
    "live2d",
];
const nameTag = [
    "",
    "EĉñĒũªěŚąñÝðŻu",
    "AiriěŤéĉñĒ",
    "MonŉĈĂŀa",
    "EnaòŃŢ",
    "KanśòŃe",
    "RuŤéĉ",
    "Smilie",
    "AnŻĂĜ",
    "NeĉñĒũªe",
    "ĶŃŁŋ",
    "ĩŌêåźæÖĬŮ",
    "¶Ķň",
    "õþĳÙ¬",
];
const dialogue = [
    "",
    "I'm ○○○-sama's little demon number four...\nŗšĮĒ¦",
    "A-am I doing it right?",
    "...",
    "Haiii～!",
    "♡",
    "→↓↑→→↓→→↑↑↓↓←→←→",
    "No, I will not do Ai♡Scream for you.",
    "We're all trapped in a maze of relationships.",
    "Reading this doesn't seem like the best use of time.",
    "úŭşÖĨÉťŖŦłÙĮŊš",
    "ÒŭŬý÷ċŷ±Ó¿ţ",
    "ª°ħ½đ¯âªńķµìķĞ",
    "âśĆŖĠŶċ÷ŭÔªĚŏ",
    "čĉÕŌŚŭś¾ĵ¾ŻĭĂÄœŁ",
    "ŧÃÍĚĤõĆ",
];
const backgrounds = [
    "/background_low_jpg/bg_black.jpg",
    "/background_low_jpg/bg_black.jpg",
    "/background_low_jpg/bg_black.jpg",
    "/background_low_jpg/bg_white.jpg",
    "/background_low_jpg/bg_white.jpg",
    "/background_low_jpg/bg_white.jpg",
    "/background_special/Background_Loop_1.jpg",
    "/background_special/Background_Loop_2.jpg",
    "/background_special/Background_Loop_3.jpg",
    "/background_special/Background_Loop_4.jpg",
    "/background_special/Background_Loop_5.jpg",
    "/background_special/Background_Loop_6.jpg",
    "/background_special/Background_Loop_7.jpg",
    "/background_special/Background_Loop_8.jpg",
];

const Content: React.FC = () => {
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);
    const [count, setCount] = useState(0);

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const hideAtPosition = 200;
        const ids = [
            "sidebar-select",
            "download",
            "export",
            "clear",
            "settings",
        ];
        const opacity = scrollPosition > hideAtPosition ? "0" : "1";
        const pointer = scrollPosition > hideAtPosition ? "none" : "auto";

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.style.opacity = opacity;
                el.style.pointerEvents = pointer;
            }
        });
    });

    if (!scene || !settings || !softError) {
        throw new Error("Context is not loaded properly.");
    }
    const { background, text, models, loopingTheRooms, setBackground } = scene;
    const {
        hide,
        setHide,
        showTutorial,
        setShowTutorial,
        deleting,
        setOpenedSidebar,
        setOpenModelOption,
        setOpenTextOption,

        effects,
        importing,
    } = settings;
    const { showErrorInformation } = softError;

    useEffect(() => {
        if (importing) {
            let backgroundSettingUp = false;
            if (models) {
                Object.values(models).forEach((m) => {
                    m.root.visible = false;
                });
            }
            const interval = setInterval(
                async () => {
                    setOpenedSidebar(
                        sidebarMenu[
                            Math.floor(Math.random() * sidebarMenu.length)
                        ],
                    );
                    setOpenModelOption(
                        modelMenu[Math.floor(Math.random() * modelMenu.length)],
                    );
                    setOpenTextOption(
                        textMenu[Math.floor(Math.random() * textMenu.length)],
                    );
                    if (!text) return;
                    text.nameTag.forEach((t) => {
                        t.text =
                            nameTag[Math.floor(Math.random() * nameTag.length)];
                        t.updateText(true);
                    });
                    text.dialogue.forEach((t) => {
                        t.text =
                            dialogue[
                                Math.floor(Math.random() * dialogue.length)
                            ];
                        t.updateText(true);
                    });
                    if (background && !backgroundSettingUp) {
                        backgroundSettingUp = true;
                        try {
                            const randomBG =
                                backgrounds[
                                    Math.floor(
                                        Math.random() * backgrounds.length,
                                    )
                                ];
                            const sprite = await getBackground(randomBG);

                            if (
                                background.backgroundContainer.children.length >
                                0
                            ) {
                                background.backgroundContainer.removeChildAt(0);
                            }
                            background.backgroundContainer.addChildAt(
                                sprite,
                                0,
                            );
                            setBackground({
                                ...background,
                                filename: randomBG,
                            });
                        } catch (e) {
                            console.error("Background glitch failed", e);
                        } finally {
                            backgroundSettingUp = false;
                        }
                    }
                    if (loopingTheRooms) {
                        loopingTheRooms.sprites.forEach((sprite) => {
                            sprite.visible = false;
                        });
                        setCount((prevCount) => {
                            const nextIndex =
                                prevCount % loopingTheRooms.sprites.length;
                            loopingTheRooms.sprites[nextIndex].visible = true;
                            return prevCount + 1;
                        });
                        console.log(count);
                    }
                },
                effects ? 50 : 2000,
            );

            return () => {
                clearInterval(interval);
            };
        }
    }, [importing]);

    return (
        <div id="content" className="center" style={{ position: "relative" }}>
            <ContentBackground />

            {showTutorial && <Tutorial show={setShowTutorial} />}
            {!hide && <SidebarSelect />}

            <div className="absolute bottom-left flex-vertical">
                {!deleting && (
                    <>
                        <DownloadButton />
                        <ExportButton />
                    </>
                )}
                <ClearButton />
            </div>
            <div className="absolute bottom-right" id="hide-sidebar">
                <button
                    className={`btn-circle ${hide ? "btn-pink" : "btn-white"}`}
                    onClick={() => {
                        setHide(!hide);
                    }}
                >
                    {hide ? (
                        <i className="sidebar__select bi bi-chevron-left" />
                    ) : (
                        <i className="sidebar__select bi bi-chevron-right" />
                    )}
                </button>
            </div>
            <div className="absolute top-left">
                {!deleting && <SettingsButton />}
            </div>
            {showErrorInformation && <SoftError />}
            <Canvas />
            <FlavorText />
        </div>
    );
};

export default Content;

// {
//     mizuBells && (
//         <Window show={setMizuBells}>
//             <div className="window__content center">
//                 <video controls>
//                     <source src="/video/persona3.mp4" type="video/mp4" />
//                 </video>
//             </div>
//         </Window>
//     );
// }
