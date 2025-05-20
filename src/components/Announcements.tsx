import React, { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";

const Announcements: React.FC = () => {
    const context = useContext(SceneContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("uiuxTest");
        if (!cookie) {
            localStorage.setItem("uiuxTest", "0");
            return;
        }
        localStorage.setItem("uiuxTest", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                A poll has been created to see if the current UI/UX is better
                than before.
            </p>
            <button
                className="btn-blue btn-regular"
                onClick={() => {
                    window.open(
                        "https://ko-fi.com/post/SEKAI-Stories-New-Features-U7U31F3UVI",
                        "_blank"
                    );
                }}
            >
                Ko-fi Poll
            </button>
            <p>
                Previous Announcement:{" "}
                <a
                    href="https://ko-fi.com/post/SEKAI-Stories-New-Features-U7U31F3UVI"
                    className="text-orange"
                    target="_blank"
                >
                    SEKAI Stories New Features!
                </a>
                .
            </p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
