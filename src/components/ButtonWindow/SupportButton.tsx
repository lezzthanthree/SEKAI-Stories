import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../UI/Window";
import { contributors } from "../../data/Constants";

const SupportButton: React.FC = () => {
    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="absolute top-right" id="support-button">
            <button
                className="btn-circle btn-orange"
                onClick={() => setShow(true)}
            >
                <i className="bi bi-question-circle-fill sidebar__select"></i>
            </button>
            {show && (
                <Window show={setShow}>
                    <div className="window__content gap-10">
                        <div className="window__divider">
                            <h1>{t("support.header")}</h1>
                            <div className="window__divider">
                                <h2>{t("support.report-header")}</h2>
                                <p>{t("support.report-details")}</p>
                                <button
                                    className="btn-blue btn-extend-width btn-regular"
                                    onClick={() => {
                                        window.open(
                                            "https://github.com/lezzthanthree/SEKAI-Stories/issues",
                                            "_blank",
                                        );
                                    }}
                                >
                                    {t("support.report-button")}
                                </button>
                            </div>
                            <div className="window__divider">
                                <h2>GitHub</h2>
                                <p>{t("support.github-details")}</p>
                                <a
                                    href="https://github.com/lezzthanthree/SEKAI-Stories"
                                    target="_blank"
                                >
                                    <img src="/img/github.jpg" alt="github" />
                                </a>
                            </div>
                        </div>

                        <div className="window__divider">
                            <h1>{t("support.special-thanks-header")}</h1>
                            <h2>
                                {t(
                                    "support.special-thanks-contributors-header",
                                )}
                            </h2>
                            <p>
                                {t(
                                    "support.special-thanks-contributors-description",
                                )}
                            </p>
                            <div className="window__divider flex flex-row items-center gap-10 flex-wrap">
                                {contributors.map((contributor, idx) => (
                                    <a
                                        key={idx}
                                        href={contributor.link}
                                        target="_blank"
                                        className="translators"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={contributor.img}
                                            alt={`contributor ${idx + 1}`}
                                        />
                                    </a>
                                ))}
                            </div>
                            <h2>Sekai Viewer</h2>
                            <p>{t("support.special-thanks-description")}</p>
                            <div className="window__divider">
                                <a href="https://sekai.best" target="_blank">
                                    <img
                                        src="/img/sekai-viewer.png"
                                        alt="sekai-viewer"
                                    />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h1>Donate</h1>
                            <div className="window__divider">
                                <h2>Ko-fi</h2>
                                <p>{t("support.ko-fi-details")}</p>
                                <a
                                    href="https://ko-fi.com/smiliepop"
                                    target="_blank"
                                >
                                    <img src="/img/kofi.jpg" alt="ko-fi" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Window>
            )}
        </div>
    );
};

export default SupportButton;
