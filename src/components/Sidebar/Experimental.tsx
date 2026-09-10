import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../contexts/SceneContext";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import localforage from "localforage";
import UploadImageButton from "../UI/UploadButton";
import {
    IRoleplaySprite,
    IRoleplaySpriteCharacters,
} from "../../types/IRoleplaySprites";

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
    const { loadingMessage, setLoadingMessage } = scene;
    const { setErrorInformation } = softError;
    const { loading, setLoading } = settings;
    const [number, setNumber] = useState(0);
    const [image, setImage] = useState<Blob | null>(null);
    const [rpImage, setRPImage] = useState<Blob | null>(null);
    const [group, setGroup] = useState("test__group");
    const [name, setName] = useState("test__name");
    const [roleplaySprites, setRoleplaySprites] =
        useState<IRoleplaySpriteCharacters>(null);

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 100);
        console.log("Setting localforage value to:", randomNumber);
        localforage.setItem("test__localforage", randomNumber);

        localforage.getItem("test__localforage").then((value) => {
            if (typeof value === "number") {
                setNumber(value);
            }
        });
        localforage.getItem("test__image").then((value) => {
            if (value instanceof Blob) {
                setImage(value);
            }
        });
        localforage.getItem("test__custom_sprites").then((value) => {
            if (value) {
                setRoleplaySprites(value as IRoleplaySpriteCharacters);
            }
        });
    }, []);

    useEffect(() => {
        localforage.setItem("test__custom_sprites", roleplaySprites);
    }, [roleplaySprites]);

    const handleUpsertSprite = (blob: Blob) => {
        const newSprite: IRoleplaySprite = {
            name,
            blob,
        };
        setRoleplaySprites((prev) => {
            const updatedGroups: IRoleplaySpriteCharacters = prev
                ? [...prev]
                : [];

            const existingGroup = updatedGroups.find((g) => g.name === group);

            if (!existingGroup) {
                updatedGroups.push({
                    name: group,
                    sprites: [newSprite],
                });

                return updatedGroups;
            }

            const existingSpriteIndex = existingGroup.sprites.findIndex(
                (s) => s.name === name,
            );

            if (existingSpriteIndex == -1) {
                existingGroup.sprites.push(newSprite);
                return updatedGroups;
            }

            existingGroup.sprites[existingSpriteIndex] = newSprite;

            localforage.setItem("test__custom_sprites", updatedGroups);

            return updatedGroups;
        });
    };

    const handleDeleteGroup = (spriteGroup: string) => {
        setRoleplaySprites((prev) => {
            const updatedGroups: IRoleplaySpriteCharacters = prev
                ? [...prev]
                : [];

            const groupIndex = updatedGroups.findIndex(
                (g) => g.name === spriteGroup,
            );
            if (groupIndex === -1) return updatedGroups;

            updatedGroups.splice(groupIndex, 1);

            return updatedGroups;
        });
    };

    const handleDeleteSprite = (spriteGroup: string, spriteName: string) => {
        setRoleplaySprites((prev) => {
            const updatedGroups: IRoleplaySpriteCharacters = prev
                ? [...prev]
                : [];

            const groupIndex = updatedGroups.findIndex(
                (g) => g.name === spriteGroup,
            );
            if (groupIndex === -1) return updatedGroups;

            const spriteIndex = updatedGroups[groupIndex].sprites.findIndex(
                (s) => s.name === spriteName,
            );
            if (spriteIndex === -1) return updatedGroups;

            updatedGroups[groupIndex].sprites.splice(spriteIndex, 1);

            return updatedGroups;
        });
    };

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
                <p>Sidebar Loading Message</p>
                <input
                    type="text"
                    name="loading"
                    id="loading"
                    value={loadingMessage}
                    onChange={(e) => {
                        setLoadingMessage(e.target.value);
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
                <h2>localForage Test</h2>
                <div className="option__content">
                    <h3>Number Test</h3>
                    <p>{number}</p>
                    <p>
                        You're seeing the past data. Look at your DevTools to
                        see what's the next number.
                    </p>
                </div>
                <div className="option__content">
                    <h3>Image Upload Test</h3>
                    <UploadImageButton
                        id="test-upload"
                        text="Upload Image"
                        uploadFunction={async (file: File) => {
                            await localforage.setItem("test__image", file);
                            setImage(file);
                        }}
                    />
                    {image && (
                        <div className="flex-vertical center">
                            <img
                                src={URL.createObjectURL(image)}
                                className="width-100"
                                alt="Uploaded"
                            />
                            <p>Saved!</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="option">
                <h2>Custom Sprite Test</h2>
                <input
                    type="text"
                    name="group-name"
                    id="group-name"
                    value={group}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const changedGroupName = event.target.value;
                        setGroup(changedGroupName);
                    }}
                />
                <input
                    type="text"
                    name="sprite-name"
                    id="sprite-name"
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const changedSpriteName = event.target.value;
                        setName(changedSpriteName);
                    }}
                />
                {rpImage && (
                    <div className="flex-vertical center">
                        <p>Preview</p>
                        <img
                            src={URL.createObjectURL(rpImage)}
                            className="width-100"
                        />
                    </div>
                )}
                <UploadImageButton
                    id="test-upload"
                    text="Upload Image"
                    uploadFunction={async (file: File) => {
                        setRPImage(file);
                    }}
                />
                {rpImage && (
                    <button
                        className="btn-regular btn-blue btn-extend-width"
                        onClick={() => {
                            handleUpsertSprite(rpImage);
                        }}
                    >
                        Save
                    </button>
                )}
                {roleplaySprites && (
                    <div>
                        {roleplaySprites.map((spriteGroup) => (
                            <div key={spriteGroup.name}>
                                <h3>{spriteGroup.name}</h3>
                                <button
                                    className="btn-red btn-regular btn-extend-width"
                                    onClick={() => {
                                        handleDeleteGroup(spriteGroup.name);
                                    }}
                                >
                                    Delete Group
                                </button>
                                <div className="flex-vertical">
                                    {spriteGroup.sprites.map(
                                        (sprite, index) => (
                                            <div key={sprite.name}>
                                                <p>{sprite.name}</p>
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(
                                                        sprite.blob,
                                                    )}
                                                    className="width-100"
                                                    alt={sprite.name}
                                                />
                                                <button
                                                    className="btn-red btn-regular btn-extend-width"
                                                    onClick={() => {
                                                        handleDeleteSprite(
                                                            spriteGroup.name,
                                                            sprite.name,
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Experimental;
