import React, { useContext, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import { useTranslation } from "react-i18next";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import SidebarOption from "../UI/SidebarOption";
import Dialogue from "./Options/Text/Dialogue";
import NameTags from "./Options/Text/NameTags";
import SceneText from "./Options/Text/SceneText";
import YOffset from "./Options/Text/YOffset";
import ChoicesText from "./Options/Text/ChoicesText";

const TextSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);
    const [bell, setBell] = useState<boolean>(false);
    const [jarona, setJarona] = useState<boolean>(false);
    const [mentalFound, setMentalFound] = useState<boolean>(false);
    const [easyNameTagSelected, setEasyNameTagSelected] = useState<string>("");

    if (!scene || !settings || !error) {
        throw new Error("Context not found");
    }

    const { text, sceneText } = scene;
    const { openTextOption, setOpenTextOption } = settings;

    if (!text || !sceneText) return <p>{t("loadings.please-wait")}</p>;

    return (
        <div>
            <h1>{t("text.header")}</h1>
            <SidebarOption
                header={t("text.name-tag.header")}
                option={openTextOption}
                setOption={setOpenTextOption}
                optionName="name-tag"
            >
                <NameTags
                    easyNameTagSelected={easyNameTagSelected}
                    setEasyNameTagSelected={setEasyNameTagSelected}
                />
            </SidebarOption>
            <SidebarOption
                header={t("text.dialogue.header")}
                option={openTextOption}
                setOption={setOpenTextOption}
                optionName="dialogue"
            >
                <Dialogue
                    bell={bell}
                    setBell={setBell}
                    jarona={jarona}
                    setJarona={setJarona}
                    mentalFound={mentalFound}
                    setMentalFound={setMentalFound}
                />
            </SidebarOption>
            <SidebarOption
                header={t("text.scene-text.header")}
                option={openTextOption}
                setOption={setOpenTextOption}
                optionName="scene-text"
            >
                <SceneText />
            </SidebarOption>
            <SidebarOption
                header={t("text.choices-text.header")}
                option={openTextOption}
                setOption={setOpenTextOption}
                optionName="choices-text"
            >
                <ChoicesText />
            </SidebarOption>
            <SidebarOption
                header={t("text.y-offset.header")}
                option={openTextOption}
                setOption={setOpenTextOption}
                optionName="y-offset"
            >
                <YOffset />
            </SidebarOption>
        </div>
    );
};

export default TextSidebar;
