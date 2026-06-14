import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContext";
import { IEasyNameTag } from "../types/IEasyNameTag";
import { announcementKey } from "../data/Constants";
import { IBackgroundBookmark } from "../types/IBackgroundBookmark";
import { SoftErrorContext } from "./SoftErrorContext";
import { IRoleplaySpriteCharacters } from "../types/IRoleplaySprites";
import localforage from "localforage";

interface SidebarProviderProps {
    children: React.ReactNode;
}
export const SettingsProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
    const error = useContext(SoftErrorContext);
    if (!error) throw new Error("Context not loaded");
    const { setErrorInformation } = error;

    const [openedSidebar, setOpenedSidebar] = useState<string>("text");
    const [hide, setHide] = useState<boolean>(false);
    const [showAnnouncement, setShowAnnouncements] = useState<boolean>(false);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
    const [showMentalHealthWindow, setShowMentalHealthWindow] =
        useState<boolean>(false);
    const [blankCanvas, setBlankCanvas] = useState<boolean>(false);
    const [showExperimental, setShowExperimental] = useState<boolean>(false);
    const [openAll, setOpenAll] = useState<boolean>(false);
    const [openTextOption, setOpenTextOption] = useState<string>("name-tag");
    const [openModelOption, setOpenModelOption] =
        useState<string>("select-layer");
    const [backgroundBookmarks, setBackgroundBookmarks] = useState<string[]>(
        [],
    );
    const [nameTags, setNameTags] = useState<IEasyNameTag>({});
    const [nameTagInputs, setNameTagInputs] = useState<number>(2);
    const [easySwitch, setEasySwitch] = useState<boolean>(false);
    const [allowRefresh, setAllowRefresh] = useState<boolean>(false);
    const [audio, setAudio] = useState<boolean>(false);
    const [startingBoxType, setStartingBoxType] = useState<
        "default" | "classic"
    >("default");
    const [loading, setLoading] = useState<number>(0);
    const [roleplaySprites, setRoleplaySprites] =
        useState<IRoleplaySpriteCharacters>([]);
    const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const showExperimental =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1";
        setShowExperimental(showExperimental);
        const announcementCookie = localStorage.getItem(announcementKey);
        if (Number(announcementCookie) < 1) {
            setShowAnnouncements(true);
        }
        const openAllCookie = localStorage.getItem("openAll");
        if (openAllCookie === "true") {
            setOpenAll(true);
        }
        const showTutorialCookie = localStorage.getItem(
            "showTutorialAndSetup-v3",
        );
        if (!showTutorialCookie || showTutorialCookie === "true") {
            setShowTutorial(true);
        }
        const audioCookie = localStorage.getItem("audio");
        if (!audioCookie || audioCookie === "true") {
            setAudio(true);
        }
        const saveDialogCookie = localStorage.getItem("saveDialog");
        if (!saveDialogCookie || saveDialogCookie === "true") {
            setShowSaveDialog(true);
        }
        const mentalHealthWindowCookie =
            localStorage.getItem("mentalHealthWindow");
        if (!mentalHealthWindowCookie || mentalHealthWindowCookie === "true") {
            setShowMentalHealthWindow(true);
        }
        const blankCanvasCookie = localStorage.getItem("blankCanvas");
        if (blankCanvasCookie === "true") {
            setBlankCanvas(true);
        }
        const easySwitchEnabled = localStorage.getItem("easySwitchEnabled");
        if (easySwitchEnabled === "true") {
            setEasySwitch(true);
        }
        const storedNameTags = localStorage.getItem("nameTags");
        if (storedNameTags) {
            setNameTags(JSON.parse(storedNameTags));
        }
        const storedNameTagInputs = localStorage.getItem("nameTagInputs");
        if (storedNameTagInputs) {
            setNameTagInputs(Number(storedNameTagInputs));
        }
        const backgroundBookmarkCookie =
            localStorage.getItem("backgroundBookmark");
        if (!backgroundBookmarkCookie) {
            localStorage.setItem("backgroundBookmark", JSON.stringify([]));
        } else {
            const bookmarks: IBackgroundBookmark = JSON.parse(
                backgroundBookmarkCookie,
            );
            setBackgroundBookmarks(bookmarks);
        }
        const startingBoxTypeCookie = localStorage.getItem(
            "startingBoxType",
        ) as "default" | "classic";
        const valid = ["default", "classic", null].includes(
            startingBoxTypeCookie,
        );
        if (startingBoxTypeCookie && valid) {
            setStartingBoxType(startingBoxTypeCookie);
        } else if (!valid) {
            setErrorInformation(
                "SEKAI Stories found an invalid starting box type on your settings. Please avoid altering the cookies!",
            );
            localStorage.setItem("startingBoxType", "default");
        }
        localforage.getItem("roleplaySprites").then((value) => {
            if (value) {
                setRoleplaySprites(value as IRoleplaySpriteCharacters);
            }
        });

        setSettingsLoaded(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("showTutorialAndSetup-v3", String(showTutorial));
    }, [showTutorial]);

    return (
        <SettingsContext.Provider
            value={{
                openedSidebar,
                setOpenedSidebar,
                hide,
                setHide,
                showAnnouncements: showAnnouncement,
                setShowAnnouncements: setShowAnnouncements,
                showTutorial,
                setShowTutorial,
                blankCanvas,
                setBlankCanvas,
                showExperimental,
                setShowExperimental,
                showSaveDialog,
                setShowSaveDialog,
                showMentalHealthWindow,
                setShowMentalHealthWindow,
                openAll,
                setOpenAll,
                openTextOption,
                setOpenTextOption,
                openModelOption,
                setOpenModelOption,
                backgroundBookmarks,
                setBackgroundBookmarks,
                easySwitch,
                setEasySwitch,
                nameTags,
                setNameTags,
                nameTagInputs,
                setNameTagInputs,
                allowRefresh,
                setAllowRefresh,
                audio,
                setAudio,
                startingBoxType,
                setStartingBoxType,
                loading,
                roleplaySprites,
                setRoleplaySprites,
                setLoading,
                settingsLoaded,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
