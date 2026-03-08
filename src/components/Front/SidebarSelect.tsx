import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const SidebarSelect: React.FC = () => {
    const settings = useContext(SettingsContext);

    if (!settings) return;

    const { openedSidebar, setOpenedSidebar, showExperimental, deleting } =
        settings;

    return (
        <div className="absolute flex-vertical" id="sidebar-select">
            {!deleting && (
                <>
                    <button
                        onClick={() => {
                            setOpenedSidebar("background");
                        }}
                        className={`btn-circle ${
                            openedSidebar == "background"
                                ? "btn-orange"
                                : "btn-white"
                        }`}
                    >
                        <i className="sidebar__select bi bi-card-image"></i>
                    </button>
                    <button
                        onClick={() => {
                            setOpenedSidebar("text");
                        }}
                        className={`btn-circle ${
                            openedSidebar == "text" ? "btn-orange" : "btn-white"
                        }`}
                    >
                        <i className="sidebar__select bi bi-chat"></i>
                    </button>
                    <button
                        onClick={() => {
                            setOpenedSidebar("model");
                        }}
                        className={`btn-circle ${
                            openedSidebar == "model"
                                ? "btn-orange"
                                : "btn-white"
                        }`}
                    >
                        <i className="sidebar__select bi bi-person-fill"></i>
                    </button>
                </>
            )}
            {showExperimental && (
                <button
                    onClick={() => {
                        setOpenedSidebar("experimental");
                    }}
                    className={`btn-circle ${
                        openedSidebar == "experimental"
                            ? "btn-orange"
                            : "btn-white"
                    }`}
                >
                    <i className="sidebar__select bi bi-flask-fill"></i>
                </button>
            )}
        </div>
    );
};

export default SidebarSelect;
