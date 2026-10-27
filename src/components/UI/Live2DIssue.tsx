import React, { useState } from "react";

interface Live2DIssueProps {
    costume: string;
}

const costumeIssueList: string[] = [
    "v2_19ena",
    "02saki_cloth001",
    "21miku_wonder",
    "16rui_cloth001",
];

const costumeCorruptedList: string[] = ["20mizuki_culture_t01"];

const Live2DIssue: React.FC<Live2DIssueProps> = ({ costume }) => {
    const [ignoreLive2DIssue, setIgnoreLive2DIssue] = useState<boolean>(
        localStorage.getItem("ignoreLive2DIssue") === "true",
    );
    const hasIssue = costumeIssueList.some((pattern) =>
        new RegExp(pattern, "i").test(costume),
    );
    const isCorrupted = costumeCorruptedList.includes(costume);
    const handleIgnore = () => {
        localStorage.setItem("ignoreLive2DIssue", "true");
        setIgnoreLive2DIssue(true);
    };

    return (
        <>
            {hasIssue && !ignoreLive2DIssue && (
                <div onClick={handleIgnore}>
                    <p>
                        <i className="bi bi-info-circle-fill blue" /> This model
                        has previously been reported having missing parts. If
                        you are still experiencing this issue, please report
                        this on GitHub.
                    </p>
                    <p>You can ignore this message by clicking/tapping.</p>
                </div>
            )}
            {isCorrupted && (
                <div>
                    <p>
                        <i className="bi bi-exclamation-triangle-fill red" />{" "}
                        This costume is corrupted or unfinished work from the
                        source.
                    </p>
                </div>
            )}
        </>
    );
};

export default Live2DIssue;
