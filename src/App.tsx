import { useContext, useEffect, useRef } from "react";
import Content from "./components/Front/Content";
import Sidebar from "./components/Front/Sidebar";
import Announcements from "./components/UI/Announcements";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "./contexts/SettingsContext";
import { useAudioManager } from "./hooks/useAudioManager";
import Loading from "./components/UI/Loading";
import { SceneContext } from "./contexts/SceneContext";
import { makeSceneJson } from "./utils/MakeSceneJson";
import { IJsonSave } from "./types/IJsonSave";

function App() {
    const { playSound } = useAudioManager();
    const settings = useContext(SettingsContext);
    const scene = useContext(SceneContext);

    if (!scene || !settings) throw new Error("Context not prepared.");

    const {
        background,
        splitBackground,
        lighting,
        text,
        sceneText,
        choicesText,
        models,
        sceneJson,
        setSceneJson,
    } = scene;

    if (!settings) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, showAnnouncements, allowRefresh, setAllowRefresh } = settings;

    const { i18n } = useTranslation();
    const lang = i18n.language;
    const jsonRef = useRef<IJsonSave | undefined>(sceneJson);

    useEffect(() => {
        jsonRef.current = sceneJson;
    }, [sceneJson]);

    useEffect(() => {
        if (!allowRefresh) {
            window.onbeforeunload = (e) => {
                e.preventDefault();
            };
        } else {
            window.onbeforeunload = null;
        }
        return () => {
            window.onbeforeunload = null;
        };
    }, [allowRefresh]);

    useEffect(() => {
        const handleButtonClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest(".close-button") ||
                target.closest(".middle-information-div") ||
                target.closest("label") ||
                target.closest("input[type='file']") ||
                target.closest("a")
            )
                return;
            playSound("/sound/select.wav");
        };

        const interval = setInterval(
            () => {
                localStorage.setItem("autoSave", JSON.stringify(jsonRef));
            },
            1000 * 60 * 3,
        );

        document.addEventListener("click", handleButtonClick, true);

        return () => {
            clearInterval(interval);
            document.removeEventListener("click", handleButtonClick);
        };
    }, []);

    useEffect(() => {
        if (
            !background ||
            !splitBackground ||
            !text ||
            !sceneText ||
            !choicesText ||
            !models ||
            !lighting
        )
            return;

        const {
            modifiedDateStamp,
            currentBackground,
            currentSplitBackground,
            currentLighting,
            currentText,
            currentSceneText,
            currentChoicesText,
            currentModels,
        } = makeSceneJson(
            background,
            splitBackground,
            text,
            sceneText,
            choicesText,
            models,
            lighting,
        );

        setSceneJson({
            lastModified: modifiedDateStamp,
            background: currentBackground,
            splitBackground: currentSplitBackground,
            lighting: currentLighting,
            text: currentText,
            sceneText: currentSceneText,
            choicesText: currentChoicesText,
            models: currentModels,
        });
        setAllowRefresh(false);
    }, [
        background,
        splitBackground,
        text,
        sceneText,
        choicesText,
        models,
        lighting,
    ]);

    return (
        <main className={`app-${lang}`} id="app">
            <Content />
            {!hide && <Sidebar />}
            {showAnnouncements && <Announcements />}
            <Loading />
        </main>
    );
}

export default App;
