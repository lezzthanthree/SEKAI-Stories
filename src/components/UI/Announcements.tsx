import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { announcementKey } from "../../utils/Constants";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
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
            <p>
                The issue regarding the missing parts on certain characters has
                been fixed!
            </p>
            <p>
                If the issue still persists, please consider refreshing your
                browser or clearing your cookies.
            </p>
            <p>
                Please consider contributing to the discussion on this{" "}
                <a
                    href="https://github.com/lezzthanthree/SEKAI-Stories/issues/20"
                    target="_blank"
                >
                    GitHub issue
                </a>{" "}
                or on this{" "}
                <a href="https://redd.it/1q5705d" target="_blank">
                    Reddit post
                </a>{" "}
                to let us know if the problem is resolved or remains ongoing.
                Your feedback is greatly appreciated!
            </p>
            <button
                className="btn-blue btn-regular"
                onClick={() => {
                    window.open(
                        "https://github.com/lezzthanthree/SEKAI-Stories/issues/20",
                        "_blank"
                    );
                }}
            >
                GitHub Issue
            </button>{" "}
            <button
                className="btn-blue btn-regular"
                onClick={() => {
                    window.open("https://redd.it/1q5705d", "_blank");
                }}
            >
                Reddit Post
            </button>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
