import { useContext, useRef, useState } from "react";
import Window from "./Window";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { useTranslation } from "react-i18next";

interface UploadImageButtonProps {
    id: string;
    uploadFunction: (file: File) => void | Promise<void>;
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
    const { t } = useTranslation();
    if (!softError) throw new Error("Context not loaded");

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
                    <div className="window__content text-center">
                        <h3>{alertMsg}</h3>
                    </div>
                </Window>
            )}
        </>
    );
};

export default UploadImageButton;
