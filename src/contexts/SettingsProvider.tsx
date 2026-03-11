import { useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContext";
import { IEasyNameTag } from "../types/IEasyNameTag";
import { announcementKey } from "../data/Constants";

interface SidebarProviderProps {
    children: React.ReactNode;
}
export const SettingsProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
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
    const [nameTags, setNameTags] = useState<IEasyNameTag>({});
    const [nameTagInputs, setNameTagInputs] = useState<number>(2);
    const [easySwitch, setEasySwitch] = useState<boolean>(false);
    const [allowRefresh, setAllowRefresh] = useState<boolean>(false);
    const [audio, setAudio] = useState<boolean>(false);
    const [loading, setLoading] = useState<number>(0);
    const [deleted, setDeleted] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [skippedFools, setSkippedFools] = useState<boolean>(false);
    const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
    const [importing, setImporting] = useState<boolean>(false);

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
            "showTutorialAndSetup-v2",
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
        const deleted = localStorage.getItem("deleted");
        if (deleted === "true") {
            setDeleted(true);
        }
        const skippedFools = localStorage.getItem("skippedFools");
        if (skippedFools === "true") {
            setSkippedFools(true);
        }
        const storedNameTags = localStorage.getItem("nameTags");
        if (storedNameTags) {
            setNameTags(JSON.parse(storedNameTags));
        }
        const storedNameTagInputs = localStorage.getItem("nameTagInputs");
        if (storedNameTagInputs) {
            setNameTagInputs(Number(storedNameTagInputs));
        }

        setSettingsLoaded(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("showTutorialAndSetup-v2", String(showTutorial));
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
                loading,
                setLoading,
                deleted,
                setDeleted,
                deleting,
                setDeleting,
                skippedFools,
                setSkippedFools,
                importing,
                setImporting,
                settingsLoaded,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
