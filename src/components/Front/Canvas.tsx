import { useContext } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { SettingsContext } from "../../contexts/SettingsContext";

const Canvas: React.FC = () => {
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!scene || !settings) throw new Error("Context not found");

    const { guideline, setGuideline } = scene;
    const { deleting } = settings;

    const handleGuidelineToggle = () => {
        if (!guideline) return;
        guideline.container.visible = !guideline.visible;
        if (setGuideline) {
            setGuideline({ ...guideline, visible: !guideline.visible });
        }
    };

    return (
        <canvas
            height={1080}
            width={1920}
            id="canvas"
            onClick={handleGuidelineToggle}
            className={deleting ? "tear shake" : ""}
        />
    );
};
export default Canvas;
