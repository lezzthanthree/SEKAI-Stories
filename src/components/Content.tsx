import React, { useContext } from "react";
import Canvas from "./Canvas";
import SidebarSelect from "./SidebarSelect";
import DownloadButton from "./DownloadButton";
import { SceneContext } from "../contexts/SceneContext";
import FlavorText from "./FlavorText";
import SettingsButton from "./SettingsButton";
import { SettingsContext } from "../contexts/SettingsContext";
import Tutorial from "./Tutorial";
import { SoftErrorContext } from "../contexts/SoftErrorContext";
import SoftError from "./UI/SoftError";
import ExportButton from "./ExportButton";
import ClearButton from "./ClearButton";
import ContentBackground from "./ContentBackground";

const Content: React.FC = () => {
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);

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
    const { hide, setHide, showTutorial, setShowTutorial } = settings;
    const { showErrorInformation } = softError;

    return (
        <div id="content" className="center" style={{ position: "relative" }}>
            <ContentBackground />

            {showTutorial && <Tutorial show={setShowTutorial} />}
            {!hide && <SidebarSelect />}

            <div className="absolute bottom-left flex-vertical">
                <DownloadButton />
                <ExportButton />
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
                <SettingsButton />
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
