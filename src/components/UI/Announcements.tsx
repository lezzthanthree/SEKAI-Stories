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
                    <div className="flex-vertical">
                        <h2>
                            Getting and changing the texture of a Live2D
                            character is now possible!
                        </h2>
                        <p>
                            Thanks to{" "}
                            <a href="https://github.com/00dani" target="_blank">
                                Danielle McLean
                            </a>{" "}
                            for her contribution!
                        </p>
                        <p>
                            You can try this feature by going to the Live2D
                            option.
                        </p>
                    </div>
                </li>
                <li className="margin-top-10">
                    You can now upload your own backgrounds under Split!
                </li>
                <li>
                    Added a warning prompt when importing a scene with unsaved
                    changes.
                </li>
                <li>Support window now includes the contributors.</li>
            </ul>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
