import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { announcementKey } from "../../data/Constants";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setShowAnnouncements } = context;

    const handleAnnouncements = () => {
        setShowAnnouncements(false);
        const cookie = localStorage.getItem(announcementKey);
        if (!cookie) {
            localStorage.setItem(announcementKey, "0");
            return;
        }
        localStorage.setItem(announcementKey, `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Few updates have been made!</p>
            <ul>
                <li>
                    Vietnamese translation has been added! Thanks to{" "}
                    <a
                        href="https://github.com/SweetSea-ButImNotSweet"
                        target="_blank"
                    >
                        SweetSea
                    </a>{" "}
                    for their contribution!
                </li>
                <li>Vietnamese text are now supported in the canvas!</li>
                <li>You can now resize the sidebar on desktop!</li>
                <li>
                    Custom default scene has been added on Settings! You can set
                    what scene you would like when starting SEKAI Stories.
                </li>
            </ul>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
