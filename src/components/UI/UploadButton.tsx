import { useContext, useRef, useState } from "react";
import Window from "./Window";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../contexts/SettingsContext";

interface UploadImageButtonProps {
    id: string;
    uploadFunction: (file: File) => void;
    text: string | React.ReactNode;
    alertMsg?: string;
    type?: string;
    disabled?: boolean;
}

const UploadImageButton: React.FC<UploadImageButtonProps> = ({
    id,
    uploadFunction,
    text,
    alertMsg,
    type = "button",
    disabled = false,
}) => {
    const softError = useContext(SoftErrorContext);
    const settings = useContext(SettingsContext);
    const { t } = useTranslation();
    if (!softError || !settings) throw new Error("Context not loaded");

    const { deleted, skippedFools } = settings;
    const { setErrorInformation } = softError;

    const uploadElement = useRef<HTMLInputElement | null>(null);
    const checkFile = (file: File) => {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validImageTypes.includes(file["type"])) {
            setErrorInformation(t("error.not-an-image"));
            return false;
        }
        return true;
    };
    const [alertWindow, setAlertWindow] = useState(false);
    return (
        <>
            <input
                ref={uploadElement}
                type="file"
                id={id}
                style={{ display: "none" }}
                accept="image/*"
                onChange={async () => {
                    if (uploadElement.current && uploadElement.current.files) {
                        const file = uploadElement.current.files[0];
                        if (file && checkFile(file)) {
                            await uploadFunction(file);
                        }
                    }
                }}
            />
            <button
                id={`btn-${id}`}
                className={
                    type == "round"
                        ? "btn-circle btn-white"
                        : "btn-regular btn-white btn-extend-width"
                }
                onClick={async () => {
                    if (!deleted && !skippedFools) {
                        setErrorInformation(
                            "It's just between you and me now... There's nowhere to go～",
                        );
                        return;
                    }
                    if (alertMsg) {
                        setAlertWindow(true);
                    } else if (uploadElement.current) {
                        uploadElement.current.click();
                    }
                }}
                disabled={disabled}
            >
                {text}
            </button>
            {alertWindow && (
                <Window
                    confirmFunction={() =>
                        uploadElement.current && uploadElement.current.click()
                    }
                    show={setAlertWindow}
                >
                    <div className="window__content">
                        <p>{alertMsg}</p>
                    </div>
                </Window>
            )}
        </>
    );
};

export default UploadImageButton;
