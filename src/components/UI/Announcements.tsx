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

    const mizookBirthday = new Date("08/27/2026");
    const daysUntil = Math.ceil(
        (mizookBirthday.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
    );

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Few updates have been made!</p>
            <ul>
                <li>
                    Updated models and backgrounds{" "}
                    {daysUntil > 0 &&
                        `(mizook birthday in ${daysUntil} ${
                            daysUntil > 1 ? "days" : "day"
                        }!)`}
                </li>
                <li>
                    All costumes list now have unique names when selecting from
                    sekai.best.
                </li>
                <li>Added a Background Blur Filter</li>
            </ul>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
