import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { SceneContext } from "../../../../contexts/SceneContext";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../../../UI/Checkbox";
import InputWindow from "../../../UI/InputWindow";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import Window from "../../../UI/Window";
import { mentalCheck } from "../../../../utils/MentalCheck";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import RadioButton from "../../../UI/RadioButton";

const SNAP = 5;

const symbols = {
    star: "☆",
    "star-filled": "★",
    squiggly: "～",
    "em-dash": "—",
    heart: "♡",
    "heart-filled": "❤︎",
    "quarter-note": "♩",
    "eighth-note": "♪",
    "beamed-eight-note": "♫",
    "beamed-sixteenth-note": "♬",
    "japanese-ellipsis": "…",
    "japanese-circle": "〇",
    "japanese-cross": "×",
};

interface DialogueProps {
    bell: boolean;
    setBell: Dispatch<SetStateAction<boolean>>;
    mentalFound: boolean;
    setMentalFound: Dispatch<SetStateAction<boolean>>;
}

const Dialogue: React.FC<DialogueProps> = ({
    mentalFound,
    setMentalFound,
    bell,
    setBell,
}) => {
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);
    if (!scene || !error || !settings) throw new Error("Context not loaded");
    const { text, setText } = scene;
    const { setErrorInformation } = error;
    const { showMentalHealthWindow } = settings;
    const [showFontSizeInput, setShowFontSizeInput] = useState<boolean>(false);
    const [mentalWindow, setMentalWindow] = useState<boolean>(false);

    useEffect(() => {
        if (text?.hideEverything) {
            setErrorInformation(t("error.hide-everything-warning"));
        }
    }, []);

    if (!text) return <p>{t("loadings.please-wait")}</p>;

    const handleDialogueBoxVisible = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const visible = Boolean(event?.target.checked);
        if (text?.textContainer) {
            text.textContainer.visible = visible;
        }
        setText({
            ...text,
            visible: visible,
        });
    };

    const handleDialogueChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const changedDialogue = event.target.value
            .replace(/“|”/g, '"')
            .replace(/‘|’/g, "'");
        text.dialogue.forEach((t) => {
            t.text = changedDialogue;
            t.updateText(true);
        });

        if (
            /bell/gim.test(changedDialogue) &&
            /mizuki/gim.test(text.nameTagString) &&
            !bell
        ) {
            window.open("https://ominous-bells.vercel.app/");
            setErrorInformation("Let Mizuki rest. She's happy now.");
            setBell(true);
        }
        const mentalResult = mentalCheck(changedDialogue);
        if (mentalResult && !mentalFound && showMentalHealthWindow) {
            setMentalWindow(true);
            setMentalFound(true);
            localStorage.setItem("mentalHealthWordFound", "true");
        }
        setText({
            ...text,
            dialogueString: changedDialogue,
        });
    };

    const handleAddSymbol = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const symbol = event.target.value;
        if (symbol !== "none") {
            text.dialogue.forEach((t) => {
                t.text += symbol;
                t.updateText(true);
            });
            setText({
                ...text,
                dialogueString: text.dialogueString + symbol,
            });
        }
    };

    const handleFontSizeSlider = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let changedFontSize = Number(event.target.value);
        if (changedFontSize > 44 - SNAP && changedFontSize < 44 + SNAP) {
            changedFontSize = 44;
        }
        handleInputFontSizeChange(changedFontSize);
    };

    const handleInputFontSizeChange = async (inputChange: string | number) => {
        const changedFontSize = Number(inputChange);
        if (changedFontSize == null || isNaN(changedFontSize)) return;
        text.dialogue.forEach((t, i) => {
            if (i == 1) {
                t.style.fontSize = changedFontSize + 4;
            } else {
                t.style.fontSize = changedFontSize;
            }
            t.style.lineHeight = Math.floor(
                55 + (changedFontSize / 44 - 1) * 40,
            );
            if (i == 0) {
                t.style.strokeThickness = 8 + (changedFontSize / 44 - 1) * 2;
            }
            t.updateText(true);
        });
        setText({
            ...text,
            fontSize: changedFontSize,
        });
    };

    const handleTextBoxTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;

        Object.entries(text.type).forEach(([type, container]) => {
            container.visible = value === type;
        });

        setText({
            ...text,
            typeSelected: value,
        });
    };
    return (
        <>
            <div className="option__content">
                <textarea
                    name="dialogue"
                    id="dialogue"
                    value={text?.dialogueString}
                    onChange={handleDialogueChange}
                ></textarea>
                <select
                    name="add-symbol"
                    id="add-symbol"
                    value="none"
                    onChange={handleAddSymbol}
                >
                    <option value="none" disabled>
                        {t("text.dialogue.add-symbol")}
                    </option>
                    {Object.entries(symbols).map(([key, value]) => (
                        <option key={key} value={value}>
                            {`${value} (${key})`}
                        </option>
                    ))}
                </select>
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("text.dialogue.font-size")} ({text.fontSize} px)
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => setShowFontSizeInput(true)}
                        ></i>
                        <i
                            className="bi bi-arrow-counterclockwise"
                            onClick={() => {
                                handleInputFontSizeChange(44);
                            }}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="font-size"
                    id="font-size"
                    value={text.fontSize}
                    min={10}
                    max={120}
                    onChange={handleFontSizeSlider}
                />
            </div>
            <div className="option__content">
                <h3>{t("text.dialogue.box-type.header")}</h3>
                <div className="flex-horizontal center padding-top-bottom-10">
                    <RadioButton
                        name="box-type"
                        value="default"
                        id="default"
                        onChange={handleTextBoxTypeChange}
                        data={text.typeSelected}
                    />
                    <label className="width-100 radio__label" htmlFor="default">
                        {t("text.dialogue.box-type.default")}
                    </label>
                </div>
                <div className="flex-horizontal center padding-top-bottom-10">
                    <RadioButton
                        name="box-type"
                        value="classic"
                        id="classic"
                        onChange={handleTextBoxTypeChange}
                        data={text.typeSelected}
                    />
                    <label className="width-100 radio__label" htmlFor="classic">
                        {t("text.dialogue.box-type.classic")}
                    </label>
                </div>
                <div className="flex-horizontal center padding-top-bottom-10">
                    <RadioButton
                        name="box-type"
                        value="mySekai"
                        id="mySekai"
                        onChange={handleTextBoxTypeChange}
                        data={text.typeSelected}
                    />
                    <label className="width-100 radio__label" htmlFor="mySekai">
                        {t("text.dialogue.box-type.mysekai")}
                    </label>
                </div>
            </div>
            <div className="option__content">
                <h3>{t("global.toggles")}</h3>
                <Checkbox
                    id="visible"
                    label={t("global.visible")}
                    checked={text.visible}
                    onChange={handleDialogueBoxVisible}
                />
                {showFontSizeInput && (
                    <InputWindow
                        show={setShowFontSizeInput}
                        confirmFunction={(x: string) =>
                            handleInputFontSizeChange(x)
                        }
                        description={t("text.dialogue.enter-font-size")}
                    />
                )}
            </div>
            {mentalWindow && (
                <Window
                    show={setMentalWindow}
                    buttons={
                        <button
                            onClick={() => {
                                window.open(
                                    "https://www.google.com/search?q=suicide+hotline",
                                    "_blank",
                                );
                                setMentalFound(true);
                            }}
                            className="btn-regular btn-blue"
                        >
                            {t("mental-health.button")}
                        </button>
                    }
                    danger
                >
                    <div className="window__content">
                        <h1> {t("mental-health.header")}</h1>
                        <p style={{ whiteSpace: "pre-line" }}>
                            {t("mental-health.details")}
                        </p>
                        <p style={{ whiteSpace: "pre-line" }}>
                            {t("mental-health.settings-details")}
                        </p>
                    </div>
                </Window>
            )}
        </>
    );
};

export default Dialogue;
