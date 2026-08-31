import React, { useContext } from "react";
import { getBackground } from "../../../../utils/GetBackground";
import BackgroundPicker from "../../../UI/BackgroundPicker";
import UploadImageButton from "../../../UI/UploadButton";
import { Checkbox } from "../../../UI/Checkbox";
import { SceneContext } from "../../../../contexts/SceneContext";
import { useTranslation } from "react-i18next";

const Select: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not found");

    const { background, setBackground, splitBackground, setSplitBackground } =
        scene;

    if (!background || !background.backgroundContainer || !splitBackground)
        return <p>{t("loadings.please-wait")}</p>;

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

    const handleSplitUploadImage = async (
        file: File,
        selected: "first" | "second",
    ) => {
        const imgSrc = URL.createObjectURL(file);
        const backgroundImage = await getBackground(imgSrc).catch();
        const splitBackgroundSelected = splitBackground[selected];
        splitBackgroundSelected.backgroundContainer.removeChildAt(0);
        splitBackgroundSelected.backgroundContainer.addChildAt(
            backgroundImage,
            0,
        );
        if (splitBackgroundSelected?.backgroundContainer) {
            setSplitBackground({
                ...splitBackground,
                [selected]: {
                    ...splitBackgroundSelected,
                    filename: imgSrc,
                    upload: true,
                },
            });
        }
    };

    const handleSplitImage = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
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
                    <UploadImageButton
                        id="background-upload"
                        uploadFunction={(file: File) => {
                            handleSplitUploadImage(file, "first");
                        }}
                        text={t("background.select.upload")}
                        alertMsg={t("background.select.upload-info")}
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
                    <UploadImageButton
                        id="background-upload"
                        uploadFunction={(file: File) => {
                            handleSplitUploadImage(file, "second");
                        }}
                        text={t("background.select.upload")}
                        alertMsg={t("background.select.upload-info")}
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
