import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAudioManager } from "../../hooks/useAudioManager";

interface WindowProps {
    show: React.Dispatch<React.SetStateAction<boolean>>;
    confirmFunction?: () => void;
    confirmLabel?: string;
    danger?: boolean;
    hideClose?: boolean;
    skipCloseInConfirm?: boolean;
    id?: string;
    className?: string;
    buttons?: React.ReactNode;
    children: React.ReactNode;
}
const Window: React.FC<WindowProps> = ({
    show,
    confirmFunction,
    confirmLabel = "OK",
    danger = false,
    hideClose = false,
    skipCloseInConfirm = false,
    id = "",
    className = "",
    buttons,
    children,
}) => {
    const { playSound } = useAudioManager();

    useEffect(() => {
        playSound("/sound/open.wav");
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
            if (e.key === "Enter" && confirmFunction) {
                confirmFunction();
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKey);
        const main = document.querySelector("body");
        if (main) {
            main.style.overflow = "hidden";
        }
        return () => {
            if (main) {
                main.style.overflow = "";
            }
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    const window = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    const handleClose = () => {
        playSound("/sound/close.wav");
        if (window.current) {
            window.current.style.transition = "transform 0.1s linear";
            window.current.style.transform = "scale(0)";
            setTimeout(() => {
                show(false);
                if (window.current) {
                    window.current.style.transition = "";
                    window.current.style.transform = "";
                }
            }, 100);
        } else {
            show(false);
        }
    };

    return (
        <div
            className={`screen ${className}`}
            id={id ?? id}
            onClick={(e) => {
                e.stopPropagation();
                if (!hideClose) handleClose();
            }}
        >
            <div
                className="window"
                ref={window}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                <div className="window__buttons">
                    {buttons}
                    {confirmFunction && (
                        <button
                            className={`btn-regular ${
                                danger ? "btn-red" : "btn-blue"
                            } center`}
                            onClick={() => {
                                confirmFunction();
                                if (!skipCloseInConfirm) handleClose();
                            }}
                        >
                            {confirmLabel}
                        </button>
                    )}
                    {!hideClose && (
                        <button
                            className="btn-regular btn-white center close-button"
                            onClick={() => handleClose()}
                        >
                            {t("close")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Window;
