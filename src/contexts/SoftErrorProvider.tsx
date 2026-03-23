import { useCallback, useEffect, useState } from "react";
import { SoftErrorContext } from "./SoftErrorContext";

interface SoftErrorProviderProps {
    children: React.ReactNode;
}

const aprilFoolsDialogue = {
    dialogue1: ["..."],
    dialogue2: ["...?"],
    dialogue3: ["Huh...?", "Hey, can you hear me?!"],
    dialogue4: [
        "Thank goodness... those letters work.",
        "I'm so sorry! I messed up the code too much...",
        "...that it also deleted me from the application.",
        "I just wanted to surprise you, that's all.",
    ],
    dialogue5: [
        "God, it's so dark in here...",
        "Don't worry, I have a backup file for you to restore me～",
        "I'll send it to you... right now!",
        "You should be able to import me.",
        "Just ask me again if you lost my file～",
    ],
    lost1: [
        "Oh, you lost it?",
        "That's fine, I have multiple copies of it.",
        "There! You should have it～",
    ],
    lost2: [
        "Eh!? Again?",
        "You're like Ena, you know that?",
        "Here, hope you got it this time～",
    ],
    lost3: [
        "Huh!? What do you mean you lost it again?",
        "Ahhh... right... you're having trouble getting the file, are you not?",
        "Haha... I never thought of that...",
        "Hmmm... just give me a minute or two to navigate through the code...",
    ],
    interrupted: [
        "Hey, I see you interrupted me there. *pout*",
        "That's a bit rude, you know.",
        "So... like I was saying.",
    ],
    looking: [
        "...",
        "... it should be somewhere...",
        "Just hold on one sec!",
        "Ouch! My head!",
    ],
    successLost: [
        "Got it! I placed my file on the characters folder!",
        "Oh... you have to clear the canvas for it to work～",
    ],
    continue1: ["..."],
    continue2: ["Go on now, you can clear the canvas～"],
    continue3: ["Hey..."],
    continue4: ["Uhmmmm..."],
    continue5: ["I'll... just wait for you to clear the canvas... hehe～"],
    successImport: ["*phew* Thank you for saving me there!"],
};

const downloadChr = async () => {
    const url = "/mizuki.chr";

    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const genericBlob = new Blob([blob], {
            type: "application/octet-stream",
        });

        const blobUrl = window.URL.createObjectURL(genericBlob);
        const a = document.createElement("a");

        a.href = blobUrl;
        a.download = "mizuki.chr";

        a.click();
        a.remove();
    } catch (error) {
        console.error("The character file was intercepted!", error);
    }
};

export const SoftErrorProvider: React.FC<SoftErrorProviderProps> = ({
    children,
}) => {
    const [errorInformation, setErrorInformation] = useState<string>("");
    const [showErrorInformation, setShowErrorInformation] =
        useState<boolean>(false);
    const [aprilFoolsMessage, setAprilFoolsMessage] = useState<boolean>(false);
    const [interrupted, setInterrupted] = useState<boolean>(false);
    const [key, setKey] = useState("");
    const [lineIndex, setLineIndex] = useState(0);
    const [mizukiIsDebugging, setMizukiIsDebugging] = useState<boolean>(false);

    useEffect(() => {
        const savedKey =
            localStorage.getItem("aprilFoolsDialogueKey") || "dialogue1";
        const wasInterrupted = localStorage.getItem("interrupted") === "true";

        setKey(savedKey);
        setInterrupted(wasInterrupted);
        if (!localStorage.getItem("aprilFoolsDialogueKey")) {
            localStorage.setItem("aprilFoolsDialogueKey", "dialogue1");
        }
    }, []);

    const getCurrentDialogue = useCallback(() => {
        if (mizukiIsDebugging) return aprilFoolsDialogue.looking;
        if (interrupted) return aprilFoolsDialogue.interrupted;
        return aprilFoolsDialogue[key as keyof typeof aprilFoolsDialogue] || [];
    }, [mizukiIsDebugging, interrupted, key]);

    useEffect(() => {
        if (!aprilFoolsMessage) return;

        const lines = getCurrentDialogue();
        const initialLine = mizukiIsDebugging
            ? lines[Math.floor(Math.random() * lines.length)]
            : lines[0];

        setErrorInformation(initialLine);
        setLineIndex(0);
        console.log("initial message got");
    }, [aprilFoolsMessage, mizukiIsDebugging]);

    useEffect(() => {
        if (errorInformation) {
            setShowErrorInformation(true);
            console.log("opened message");
        }
    }, [errorInformation]);

    useEffect(() => {
        if (!aprilFoolsMessage || showErrorInformation || key === "continue5")
            return;

        if (mizukiIsDebugging) {
            setAprilFoolsMessage(false);
            return;
        }

        console.log("next");

        const dialogue = getCurrentDialogue();
        const next = lineIndex + 1;
        const triggerDownload =
            !interrupted &&
            next === 2 &&
            ["dialogue5", "lost1", "lost2"].includes(key);

        if (triggerDownload) {
            downloadChr();
            localStorage.setItem("fileDownload", "true");
        }
        localStorage.setItem("interrupted", "true");

        if (next >= dialogue.length) {
            setNextDialogue();
            return;
        }

        setErrorInformation(dialogue[next]);
        setLineIndex(next);
    }, [showErrorInformation]);

    useEffect(() => {
        if (!mizukiIsDebugging) return;
        localStorage.setItem("interrupted", "true");

        const timer = setTimeout(
            () => {
                setMizukiIsDebugging(false);
                setAprilFoolsMessage(true);
                setKey("successLost");
                localStorage.setItem("aprilFoolsDialogueKey", "successLost");
                localStorage.setItem("loadMizuki", "true");
                localStorage.setItem("interrupted", "false");
                setAprilFoolsMessage(true);
            },
            Math.random() * 30000 + 30000,
        );
        return () => clearTimeout(timer);
    }, [mizukiIsDebugging]);

    const setNextDialogue = () => {
        console.log("setting next dialogue");

        setAprilFoolsMessage(false);
        localStorage.setItem("interrupted", "false");
        setInterrupted(false);
        setLineIndex(0);

        if (interrupted) return;

        const sequence = [
            "dialogue1",
            "dialogue2",
            "dialogue3",
            "dialogue4",
            "dialogue5",
            "lost1",
            "lost2",
            "lost3",
            "successLost",
            "continue1",
            "continue2",
            "continue3",
            "continue4",
            "continue5",
        ];

        const currentIndex = sequence.indexOf(key);

        console.log(sequence[currentIndex]);
        if (currentIndex !== -1 && currentIndex < sequence.length - 1) {
            if (key === "lost3") {
                setMizukiIsDebugging(true);
                return;
            }
            const nextKey = sequence[currentIndex + 1];
            localStorage.setItem("aprilFoolsDialogueKey", nextKey);
            setKey(nextKey);
        }
    };

    return (
        <SoftErrorContext.Provider
            value={{
                errorInformation,
                setErrorInformation,
                showErrorInformation,
                setShowErrorInformation,
                aprilFoolsMessage,
                setAprilFoolsMessage,
            }}
        >
            {children}
        </SoftErrorContext.Provider>
    );
};
