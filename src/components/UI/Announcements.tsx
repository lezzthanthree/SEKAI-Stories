import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { announcementKey } from "../../data/Constants";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setShowAnnouncements, skippedFools } = context;

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
            {skippedFools ? (
                <>
                    <h2>Happy April Fools!</h2>
                    <p>
                        You have successfully brought Mizuki back to the
                        character folder!
                    </p>
                    <p>
                        The devs would love to hear your feedback regarding the
                        event and the application!
                    </p>
                    <button
                        className="btn-regular btn-blue"
                        onClick={(e) => {
                            e.stopPropagation();

                            window.open(
                                "https://forms.gle/BC4Pmv5HLZThrTaY8",
                                "_blank",
                            );
                        }}
                    >
                        Feedback Form
                    </button>
                </>
            ) : (
                <>
                    <h2>Notice</h2>
                    <p>
                        A strange bug has been discovered here in SEKAI Stories.
                    </p>
                    <p>
                        Please try to ignore this issue while we work on a fix.
                        We apologize for the inconvenience.
                    </p>
                </>
            )}
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
