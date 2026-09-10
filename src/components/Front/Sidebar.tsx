import React, { useContext } from "react";
import TextSidebar from "../Sidebar/TextSidebar";
import { SceneContext } from "../../contexts/SceneContext";
import BackgroundSidebar from "../Sidebar/BackgroundSidebar";
import ModelSidebar from "../Sidebar/ModelSidebar";
import { SettingsContext } from "../../contexts/SettingsContext";
import Experimental from "../Sidebar/Experimental";

const Sidebar: React.FC = () => {
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!scene || !settings) return;

    const { loadingMessage } = scene;
    const { openedSidebar } = settings;

    return (
        <div id="sidebar">
            {loadingMessage === "" && (
                <>
                    {openedSidebar == "background" && <BackgroundSidebar />}
                    {openedSidebar == "text" && <TextSidebar />}
                    {openedSidebar == "model" && <ModelSidebar />}
                </>
            )}
            {openedSidebar == "experimental" && <Experimental />}

            {loadingMessage && <p>{loadingMessage}</p>}
        </div>
    );
};

export default Sidebar;
