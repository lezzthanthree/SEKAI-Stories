import React, { useContext } from "react";
import { getBackground } from "../../../../utils/GetBackground";
import BackgroundPicker from "../../../UI/BackgroundPicker";
import UploadImageButton from "../../../UI/UploadButton";
import { Checkbox } from "../../../UI/Checkbox";
import { SceneContext } from "../../../../contexts/SceneContext";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";

const Select: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);
    if (!scene || !settings || !error) throw new Error("Context not found");

    const { background, setBackground, splitBackground, setSplitBackground } =
        scene;
    const { deleted, skippedFools } = settings;
    const { setErrorInformation } = error;

    if (!background || !background.backgroundContainer)
        return <p>{t("please-wait")}</p>;

    const handleUploadImage = async (file: File) => {
        const imgSrc = URL.createObjectURL(file);
        const backgroundImage = await getBackground(imgSrc).catch();
        background.backgroundContainer.removeChildAt(0);
        background.backgroundContainer.addChildAt(backgroundImage, 0);
        if (background?.backgroundContainer) {
            setBackground({
                ...background,
                filename: imgSrc,
                upload: true,
            });
        }
    };

    const handleSplitImage = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!deleted && !skippedFools) {
            setErrorInformation(
                "function handleSplitImage not defined: 'Do you still need another background when you have me? ♡'",
            );
            return;
        }
        const value = event.target.checked;

        if (splitBackground?.splitContainer) {
            splitBackground.splitContainer.visible = value;
            setSplitBackground({
                ...splitBackground,
                visible: value,
            });
        }
    };

    return (
        <>
            {splitBackground?.visible ? (
                <>
                    <BackgroundPicker
                        background={splitBackground.first}
                        setFunction={(bg) => {
                            setSplitBackground({
                                ...splitBackground,
                                first: {
                                    ...splitBackground.first,
                                    filename: bg,
                                },
                            });
                        }}
                    />
                    <BackgroundPicker
                        background={splitBackground.second}
                        setFunction={(bg) => {
                            setSplitBackground({
                                ...splitBackground,
                                second: {
                                    ...splitBackground.second,
                                    filename: bg,
                                },
                            });
                        }}
                    />
                </>
            ) : (
                <>
                    <BackgroundPicker
                        background={background}
                        setFunction={(bg) => {
                            setBackground({
                                ...background,
                                filename: bg,
                            });
                        }}
                    />
                    <UploadImageButton
                        id="background-upload"
                        uploadFunction={handleUploadImage}
                        text={t("background.select.upload")}
                        alertMsg={t("background.select.upload-info")}
                    />
                </>
            )}
            <Checkbox
                id="split"
                label={t("background.select.split-location")}
                checked={splitBackground?.visible}
                onChange={handleSplitImage}
            />
        </>
    );
};

export default Select;
