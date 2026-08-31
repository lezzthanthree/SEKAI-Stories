import React from "react";

interface SettingsGroupProps {
    header: string;
    children?: React.ReactNode;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({
    header: header = "Hello, World!",
    children,
}) => {
    return (
        <div className="window__divider">
            <h2>{header}</h2>
            <div className="window__divider">{children}</div>
        </div>
    );
};

export default SettingsGroup;
