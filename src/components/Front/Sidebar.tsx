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

    const { startingMessage } = scene;
    const { openedSidebar, deleting } = settings;

    return (
        <div id="sidebar">
            {!deleting && (
                <>
                    {openedSidebar == "background" && <BackgroundSidebar />}
                    {openedSidebar == "text" && <TextSidebar />}
                    {openedSidebar == "model" && <ModelSidebar />}
                </>
            )}
            {openedSidebar == "experimental" && <Experimental />}
            {startingMessage && <p>{startingMessage}</p>}
        </div>
    );
};

export default Sidebar;
