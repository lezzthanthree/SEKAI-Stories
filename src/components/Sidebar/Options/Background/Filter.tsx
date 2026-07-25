import React, { useContext } from "react";
import { Checkbox } from "../../../UI/Checkbox";
import { SceneContext } from "../../../../contexts/SceneContext";
import { AdjustmentFilter } from "pixi-filters";
import { sickEffect } from "../../../../utils/SickEffect";
import { getBackground } from "../../../../utils/GetBackground";
import * as PIXI from "pixi.js";
import { useTranslation } from "react-i18next";
import POVFilter from "./POVFilter";
import Contrast from "./Contrast";
import { toggleSekaiTransition } from "../../../../utils/SekaiTransition";
import Vignette from "./Vignette";
import BackgroundBlur from "./BackgroundBlur";

const Filter: React.FC = () => {
    const scene = useContext(SceneContext);
    const { t } = useTranslation();

    if (!scene) throw new Error("Context not found");

    const { app, filter, background, setFilter } = scene;

    const handleFlashback = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!filter?.container) return;

        const value = event.target.checked;

        if (value) {
            const adjustmentFilter = new AdjustmentFilter({
                saturation: 0.5,
                brightness: 0.9,
            });
            filter.container.filters = [adjustmentFilter];
        } else {
            filter.container.filters = [];
        }

        setFilter({
            ...filter,
            flashback: value,
            monochrome: {
                contrast: 1,
                show: false,
            },
        });
    };

    const handleMonochrome = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!filter?.container) return;

        const value = event.target.checked;
        let adjustmentFilter: AdjustmentFilter | undefined;

        if (value) {
            adjustmentFilter = new AdjustmentFilter({
                saturation: 0,
            });
            filter.container.filters = [adjustmentFilter];
        } else {
            filter.container.filters = [];
        }

        setFilter({
            ...filter,
            flashback: false,
            monochrome: {
                contrast: 1,
                show: value,
                adjustmentFilter: adjustmentFilter ?? undefined,
            },
        });
    };

    const handleSick = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!filter?.container) return;

        const value = event.target.checked;

        let sickContainer;
        if (value) {
            sickContainer = await sickEffect(app, filter.container);
            filter.container.addChildAt(sickContainer, 3);
        } else {
            if (!filter.sick) return;
            const sickContainer = filter.sick.container;
            sickContainer?.destroy();
        }

        setFilter({
            ...filter,
            sick: {
                container: sickContainer,
                show: value,
            },
        });
    };

    const handleVignette = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!filter?.container) return;

        const value = event.target.checked;
        let vignetteContainer;
        let adjustmentFilter: AdjustmentFilter | undefined;

        if (value) {
            const vignetteImage = await getBackground(
                "/img/vignette-round.png",
            );
            vignetteImage.anchor.set(0.5, 0.5);
            vignetteImage.position.set(1920 / 2, 1080 / 2);
            vignetteContainer = new PIXI.Container();

            vignetteContainer.addChildAt(vignetteImage, 0);
            adjustmentFilter = new AdjustmentFilter({
                contrast: 1,
            });
            filter.container.addChildAt(vignetteContainer, 3);
            vignetteContainer.filters = [adjustmentFilter];
        } else {
            filter.vignette?.container?.destroy();
        }

        setFilter({
            ...filter,
            vignette: {
                container: vignetteContainer,
                show: value,
                contrast: 1,
                adjustmentFilter,
            },
        });
    };

    const handleBackgroundBlur = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!background?.backgroundContainer || !filter) return;

        const value = event.target.checked;
        const container = background.backgroundContainer;
        let blurFilter: PIXI.BlurFilter | undefined;
        const blur = 5;

        if (value) {
            blurFilter = new PIXI.BlurFilter(blur);
            container.filters = [blurFilter];
        } else {
            container.filters = [];
        }

        setFilter({
            ...filter,
            backgroundBlur: {
                show: value,
                blurFilter,
                blur,
            },
        });
    };

    const handleDroop = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!filter?.container) return;

        const value = event.target.checked;
        let droopContainer;

        if (value) {
            const droopLines = await getBackground("/img/droop.png");
            droopContainer = new PIXI.Container();

            droopContainer.addChildAt(droopLines, 0);

            filter.container.addChildAt(droopContainer, 3);
        } else {
            filter.droop?.container?.destroy();
        }

        setFilter({
            ...filter,
            droop: {
                container: droopContainer,
                show: value,
            },
        });
    };

    const handlePOV = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!filter?.container) return;
        const value = event.target.checked;
        if (!value) {
            filter.container.position.set(1920 / 2, 1080 / 2);
            filter.container.scale.set(1, 1);
        }
        setFilter({
            ...filter,
            pov: {
                show: value,
                x: 0,
                y: 0,
                zoom: 1,
            },
        });
    };

    const handleSekaiTransition = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!filter?.container || !app) return;
        const value = event.target.checked;
        const container = filter.container;

        const entity = toggleSekaiTransition(
            container,
            app,
            value,
            filter.sekaiTransition?.entity,
        );

        setFilter({
            ...filter,
            sekaiTransition: {
                show: value,
                entity: entity,
            },
        });
    };

    return (
        <div>
            <Checkbox
                id="flashback"
                label={t("background.filters.flashback")}
                checked={filter?.flashback}
                onChange={handleFlashback}
            />
            <Checkbox
                id="monochrome"
                label={t("background.filters.monochrome")}
                checked={filter?.monochrome?.show}
                onChange={handleMonochrome}
            />
            {filter?.monochrome?.show && (
                <Contrast filter={filter} setFilter={setFilter} />
            )}
            <Checkbox
                id="drooping-lines"
                label={t("background.filters.drooping-lines")}
                checked={filter?.droop?.show}
                onChange={handleDroop}
            />
            <Checkbox
                id="sick"
                label={t("background.filters.sick")}
                checked={filter?.sick?.show}
                onChange={handleSick}
            />
            <Checkbox
                id="vignette"
                label={t("background.filters.vignette")}
                checked={filter?.vignette?.show}
                onChange={handleVignette}
            />
            {filter?.vignette?.show && (
                <Vignette filter={filter} setFilter={setFilter} />
            )}
            <Checkbox
                id="pov"
                label={t("background.filters.pov")}
                checked={filter?.pov?.show}
                onChange={handlePOV}
            />
            {filter?.pov?.show && (
                <POVFilter filter={filter} setFilter={setFilter} />
            )}
            <Checkbox
                id="pov"
                label={t("background.filters.background-blur")}
                checked={filter?.backgroundBlur?.show}
                onChange={handleBackgroundBlur}
            />
            {filter?.backgroundBlur?.show && (
                <BackgroundBlur filter={filter} setFilter={setFilter} />
            )}
            <Checkbox
                id="sekaiTransition"
                label={t("background.filters.sekai-transition")}
                checked={filter?.sekaiTransition?.show}
                onChange={handleSekaiTransition}
            />
        </div>
    );
};

export default Filter;
