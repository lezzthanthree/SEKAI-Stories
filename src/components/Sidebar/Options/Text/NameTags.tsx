import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";
import { SceneContext } from "../../../../contexts/SceneContext";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import RadioButton from "../../../UI/RadioButton";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import { Checkbox } from "../../../UI/Checkbox";
import { useTranslation } from "react-i18next";

interface NameTagsProps {
    easyNameTagSelected: string;
    setEasyNameTagSelected: Dispatch<SetStateAction<string>>;
}

const mizukiName = "Mizuki";

const NameTags: React.FC<NameTagsProps> = ({
    easyNameTagSelected,
    setEasyNameTagSelected,
}) => {
    const { t, i18n } = useTranslation();

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);
    const [cycle, setCycle] = useState<number>(0);

    if (!scene || !settings || !error) throw new Error("Context not loaded");
    const { text, setText, reset, setReset } = scene;
    const {
        easySwitch,
        setEasySwitch,
        nameTags,
        setNameTags,
        nameTagInputs,
        setNameTagInputs,
        deleted,
        skippedFools,
        setSkippedFools,
    } = settings;
    const { setErrorInformation } = error;

    const easyNameTagPlaceholders = useMemo(() => {
        if (!deleted && !skippedFools) {
            return [
                t("character.mizuki"),
                t("character.mizuki"),
                t("character.mizuki"),
                t("character.mizuki"),
                t("character.mizuki"),
                t("character.mizuki"),
            ];
        }
        return [
            t("character.miku"),
            t("character.rin"),
            t("character.len"),
            t("character.luka"),
            t("character.meiko"),
            t("character.kaito"),
        ];
    }, [i18n.language, deleted, skippedFools]);

    if (!text) return <p>{t("please-wait")}</p>;

    const handleNameTagChange = async (changedNameTag: string) => {
        if (!deleted && !skippedFools) {
            text.nameTag.forEach((t) => {
                t.text = t.text + mizukiName[cycle];
                t.updateText(true);
            });
            setText({
                ...text,
                nameTagString: changedNameTag,
            });
            if (/skip/gim.test(changedNameTag) && !skippedFools) {
                setErrorInformation(
                    "April Fools scene skipped. Will be reverting to default.",
                );
                setSkippedFools(true);
                setReset(reset + 1);
                localStorage.setItem("skippedFools", "true");
                return;
            }
            setCycle((cycle + 1) % mizukiName.length);
            return;
        }

        text.nameTag.forEach((t) => {
            t.text = changedNameTag;
            t.updateText(true);
        });
        setText({
            ...text,
            nameTagString: changedNameTag,
        });
    };

    const handleEasyNameTagChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        nameTag: string,
    ) => {
        const name = event.target.value;
        const radio = document.querySelector(
            `input[name="name-tag"][value="${nameTag}"]`,
        ) as HTMLInputElement;
        const changeEasyNameTags = { ...nameTags, [nameTag]: name };
        setNameTags(changeEasyNameTags);
        if (radio.checked) {
            handleNameTagChange(name);
        }
        localStorage.setItem("nameTags", JSON.stringify(changeEasyNameTags));
    };

    const handleEasyNameTagSelect = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;
        let changedNameTag = "";
        changedNameTag = nameTags[value];
        text.nameTag.forEach((t) => {
            t.text = changedNameTag;
            t.updateText(true);
        });
        setText({
            ...text,
            nameTagString: changedNameTag,
        });
        setEasyNameTagSelected(value);
    };

    const handleEasyNameTagInputs = (action: "add" | "remove") => {
        if (action === "add" && nameTagInputs < 6) {
            setNameTagInputs((prev) => prev + 1);
            localStorage.setItem("nameTagInputs", String(nameTagInputs + 1));
            return;
        }
        if (action === "remove" && nameTagInputs > 2) {
            setNameTagInputs((prev) => prev - 1);
            localStorage.setItem("nameTagInputs", String(nameTagInputs - 1));
            return;
        }

        setErrorInformation(t("error.name-tag-inputs-limit"));
    };

    return (
        <>
            {!easySwitch ? (
                <input
                    type="text"
                    name="name-tag"
                    id="name-tag"
                    value={text?.nameTagString}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const changedNameTag = event.target.value;
                        handleNameTagChange(changedNameTag);
                    }}
                />
            ) : (
                <>
                    {Array.from({ length: nameTagInputs }).map((_, index) => (
                        <div key={index} className="flex-horizontal center">
                            <RadioButton
                                name="name-tag"
                                value={`nameTag${index + 1}`}
                                onChange={handleEasyNameTagSelect}
                                data={easyNameTagSelected}
                            />
                            <input
                                type="text"
                                name="name-tag"
                                value={nameTags[`nameTag${index + 1}`]}
                                onChange={(e) => {
                                    handleEasyNameTagChange(
                                        e,
                                        `nameTag${index + 1}`,
                                    );
                                }}
                                placeholder={easyNameTagPlaceholders[index]}
                            />
                        </div>
                    ))}
                    <div className="layer-buttons">
                        <button
                            className="btn-circle btn-white"
                            onClick={() => handleEasyNameTagInputs("add")}
                        >
                            <i className="bi bi-plus-circle"></i>
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={() => handleEasyNameTagInputs("remove")}
                        >
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </div>
                </>
            )}

            <Checkbox
                id="easy-switch"
                label={t("text.name-tag.easy-switch")}
                checked={easySwitch}
                onChange={() => {
                    setEasySwitch(!easySwitch);
                    localStorage.setItem(
                        "easySwitchEnabled",
                        String(!easySwitch),
                    );
                }}
            />
        </>
    );
};

export default NameTags;
