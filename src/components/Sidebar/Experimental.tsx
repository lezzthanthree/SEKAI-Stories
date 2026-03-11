import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../contexts/SceneContext";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import { Checkbox } from "../UI/Checkbox";

const Crash: React.FC = () => {
    throw new Error("Can you hear the ominous bells tolling?");
    return <></>;
};

const Experimental: React.FC = () => {
    const { i18n } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);
    const [crash, setCrash] = useState(false);

    if (!scene || !softError || !settings) throw new Error("Context not found");
    const { setErrorInformation } = softError;
    const {
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
    } = settings;
    const { reset, setReset } = scene;

    return (
        <div>
            <h1>Experimental</h1>
            <p>
                This experimental section is only used for testing and other new
                features.
            </p>

            <div className="option">
                <h2>Language</h2>
                <div className="option__content">
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        {Object.keys(i18n.options.resources || {}).map(
                            (lng) => (
                                <option key={lng} value={lng}>
                                    {lng}
                                </option>
                            ),
                        )}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Loading</h2>
                <p>{loading}</p>
                <input
                    type="range"
                    name="loading"
                    id="loading"
                    min={0}
                    max={100}
                    value={loading}
                    onChange={(e) => {
                        setLoading(Number(e.target.value));
                    }}
                />
            </div>
            <div className="option">
                <h2>Error</h2>
                <div className="option__content">
                    <button
                        className="btn-regular btn-100 btn-white"
                        onClick={() => {
                            const msg = [
                                "Authentication failure or unable to access server.\nPlease check your internet connection and try again later.\nIf this issue persists, please check the FAQ for solutions.",
                                "Room disbanded. (103)",
                            ];
                            setErrorInformation(
                                msg[Math.floor(Math.random() * msg.length)],
                            );
                        }}
                    >
                        Soft error
                    </button>
                    <button
                        className="btn-regular btn-100 btn-red"
                        onClick={() => {
                            setCrash(true);
                        }}
                    >
                        CRASH
                    </button>
                    {crash && <Crash />}
                </div>
            </div>
            <div className="option">
                <h2>April Fools</h2>
                <div className="option__content">
                    <button
                        className="btn-regular btn-100 btn-blue"
                        onClick={() => {
                            setReset(reset - 1);
                        }}
                    >
                        Reset -1
                    </button>
                    <button
                        className="btn-regular btn-100 btn-blue"
                        onClick={() => {
                            setReset(0);
                        }}
                    >
                        Reset 0
                    </button>
                    <p>Reset: {reset}</p>
                    <Checkbox
                        id="visible"
                        label="deleted"
                        checked={deleted}
                        onChange={(e) => {
                            setDeleted(e.target.checked);
                            localStorage.setItem(
                                "deleted",
                                `${e.target.checked}`,
                            );
                            setReset(reset + 1);
                        }}
                    />
                    <Checkbox
                        id="visible"
                        label="deleting"
                        checked={deleting}
                        onChange={(e) => {
                            setDeleting(e.target.checked);
                            localStorage.setItem(
                                "deleting",
                                `${e.target.checked}`,
                            );
                            setReset(reset + 1);
                        }}
                    />
                    <Checkbox
                        id="visible"
                        label="skippedFools"
                        checked={skippedFools}
                        onChange={(e) => {
                            setSkippedFools(e.target.checked);
                            localStorage.setItem(
                                "skippedFools",
                                `${e.target.checked}`,
                            );
                            setReset(reset + 1);
                        }}
                    />
                    <Checkbox
                        id="visible"
                        label="importing"
                        checked={importing}
                        onChange={(e) => {
                            setImporting(e.target.checked);
                            localStorage.setItem(
                                "importing",
                                `${e.target.checked}`,
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Experimental;
