import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("pre-5.9.3-announcements");
        if (!cookie) {
            localStorage.setItem("pre-5.9.3-announcements", "0");
            return;
        }
        localStorage.setItem(
            "pre-5.9.3-announcements",
            `${Number(cookie) + 1}`
        );
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                The issue regarding the missing parts on certain characters has
                been fixed!
            </p>
            <p>
                But, before I push this update to this site, I would like
                everyone to try and test the generator. You can visit the
                testing website here at anytime!
            </p>
            <button className="btn-blue btn-regular" onClick={() => {window.open("https://release.sekai-stories.pages.dev", "_blank")}}>
                SEKAI Stories Testing
            </button>

            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
