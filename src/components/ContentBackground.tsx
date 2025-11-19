import React, { useContext, useEffect, useRef } from "react";
import { SceneContext } from "../contexts/SceneContext";

const ContentBackground: React.FC = () => {
    const contentBackground = useRef<HTMLDivElement | null>(null);
    const splitBackground1 = useRef<HTMLDivElement | null>(null);
    const splitBackground2 = useRef<HTMLDivElement | null>(null);

    const scene = useContext(SceneContext);

    useEffect(() => {
        if (!scene || !scene.background) return;
        if (contentBackground.current) {
            contentBackground.current.style.backgroundImage = scene?.background
                .filename
                ? `url("${scene.background.filename}")`
                : "";
        }
    }, [scene]);

    useEffect(() => {
        if (!scene || !scene.splitBackground) return;
        if (splitBackground1.current && splitBackground2.current) {
            splitBackground1.current.style.backgroundImage = scene?.splitBackground.first
                .filename
                ? `url("${scene.splitBackground.first.filename}")`
                : "";
            splitBackground2.current.style.backgroundImage = scene?.splitBackground.first
                .filename
                ? `url("${scene.splitBackground.second.filename}")`
                : "";
        }
    }, [scene]);

    if (!scene || !scene.background || !scene.splitBackground) return;

    return scene.splitBackground.visible ? (
        <>
            <div id="split-background-1" ref={splitBackground1} />
            <div id="split-background-2" ref={splitBackground2} />
        </>
    ) : (
        <div id="content-background" ref={contentBackground} />
    );
};

export default ContentBackground;
