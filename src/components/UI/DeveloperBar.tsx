import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const DeveloperBar: React.FC = () => {
    const settings = useContext(SettingsContext);

    if (!settings) return;

    const { showExperimental } = settings;

    if (!showExperimental) return;

    return (
        <div className="development-bar">
            <p>DEVELOPER MODE</p>
        </div>
    );
};

export default DeveloperBar;
