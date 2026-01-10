import { AdjustmentFilter, CRTFilter } from "pixi-filters";
import {
    InternalModel,
    Live2DModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import * as PIXI from "pixi.js";
import { getBackground } from "./GetBackground";

const CONFIG = {
    TRIANGLE_COLORS: [0xff00ff, 0x00ffff, 0xffff00],
    TRIANGLE_SIZE_MIN: 100,
    TRIANGLE_SIZE_MAX: 200,
    TRIANGLE_VELOCITY_X_MAX: 0.5,
    TRIANGLE_VELOCITY_Y_MIN: -0.5,
    TRIANGLE_VELOCITY_Y_MAX: 0.5,
    TRIANGLE_LIFETIME_SECONDS_MIN: 5,
    TRIANGLE_LIFETIME_SECONDS_MAX: 10,
    TRIANGLE_FADE_IN_SECONDS: 0.5,
    TRIANGLE_SPAWN_INTERVAL_MS: 250,
    TRIANGLE_ROTATION_SPEED_MIN: 0.01,
    TRIANGLE_ROTATION_SPEED_MAX: 0.03,
    TRIANGLE_SPAWN_AREA_X_FACTOR: 0.8,
    TRIANGLE_SPAWN_AREA_Y_FACTOR: 0.5,

    MAX_ACTIVE_TRIANGLES: 15,
};

class TriangleParticle extends PIXI.Graphics {
    initialAlpha: number;
    maxLifetime: number;
    fadeInDuration: number;
    currentLifetime: number;
    rotationSpeed: number;
    velocityX: number;
    velocityY: number;
    constructor(
        x: number,
        y: number,
        color: number,
        size: number,
        isFilled: boolean,
        velocityX: number,
        velocityY: number,
        rotationSpeed: number,
        lifetime: number,
        fadeInDuration: number
    ) {
        super();
        this.x = x;
        this.y = y;
        this.initialAlpha = 1;
        this.alpha = 0;
        this.maxLifetime = lifetime;
        this.fadeInDuration = fadeInDuration;
        this.currentLifetime = 0;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = rotationSpeed;

        if (isFilled) {
            this.beginFill(color);
            this.drawPolygon([
                -size / 2,
                size / 2,
                size / 2,
                size / 2,
                0,
                -size / 2,
            ]);
            this.endFill();
        } else {
            this.lineStyle(10, color);
            this.drawPolygon([
                -size / 2,
                size / 2,
                size / 2,
                size / 2,
                0,
                -size / 2,
            ]);
        }

        this.velocityX = velocityX;
        this.velocityY = velocityY;

        this.blendMode = PIXI.BLEND_MODES.ADD;
        this.pivot.set(0, 0);
    }

    update(deltaFrames: number, app: PIXI.Application) {
        this.x += this.velocityX * deltaFrames;
        this.y += this.velocityY * deltaFrames;

        this.rotation += this.rotationSpeed * deltaFrames;

        this.currentLifetime += app.ticker.deltaMS / 1000;

        if (this.currentLifetime < this.fadeInDuration) {
            this.alpha =
                this.initialAlpha *
                (this.currentLifetime / this.fadeInDuration);
        } else {
            const fadeOutTime = this.maxLifetime - this.fadeInDuration;
            const elapsedFadeOutTime =
                this.currentLifetime - this.fadeInDuration;
            this.alpha =
                this.initialAlpha * (1 - elapsedFadeOutTime / fadeOutTime);
        }

        return this.currentLifetime >= this.maxLifetime;
    }
}

class HologramLightEffect extends PIXI.Container {
    light: PIXI.Graphics;
    elapsed: number = 0;
    color: number;

    constructor(width: number, height: number, color: number = 0xffffff) {
        super();

        this.width = width;
        this.height = height;
        this.color = color;

        this.light = new PIXI.Graphics();
        this.light.alpha = 0.7;
        this.addChild(this.light);
        HologramLightEffect.addTexture(this.light, width, height);
    }

    private static async addTexture(
        light: PIXI.Graphics,
        width: number,
        height: number
    ): Promise<void> {
        const sprite = await getBackground("/img/hologram_texture.png", false);
        light.clear();
        light.beginTextureFill({
            texture: sprite.texture,
            matrix: new PIXI.Matrix().scale(
                width / sprite.texture.width,
                height / sprite.texture.height
            ),
        });
        light.moveTo(width / 3, height);
        light.lineTo(0, 0);
        light.lineTo(width, 0);
        light.lineTo((2 * width) / 3, height);
        light.closePath();
        light.endFill();
        light.pivot.set(width / 2, height / 2);
        light.position.set(width / 2, height / 2);
    }

    update(delta: number) {
        this.elapsed += delta;
        this.light.alpha = 0.9 + 0.1 * Math.sin(this.elapsed * 0.1);
        this.light.scale.x = 1 + 0.01 * Math.sin(this.elapsed * 0.1);
        // this.light.scale.y = 1 + 0.03 * Math.cos(this.elapsed * 0.17);
    }
}

const spawnHologram = (character: Live2DModel<InternalModel>) => {
    const bounds = character.getLocalBounds();

    const hologram = new HologramLightEffect(bounds.width, bounds.height);
    character.addChild(hologram);

    const animateHologram = () => {
        hologram.update(0.1);
        requestAnimationFrame(animateHologram);
    };

    animateHologram();

    return hologram;
};

const spawnTriangle = (
    character: Live2DModel<InternalModel>,
    activeTriangles: TriangleParticle[]
) => {
    if (activeTriangles.length >= CONFIG.MAX_ACTIVE_TRIANGLES) {
        return;
    }

    const bounds = character.getLocalBounds();

    const centerX = bounds.width / 2;
    const scatterRangeX = bounds.width * CONFIG.TRIANGLE_SPAWN_AREA_X_FACTOR;
    const spawnX = centerX + (Math.random() - 0.5) * scatterRangeX;

    const centerY = (bounds.y + bounds.height) / 2;
    const scatterRangeY = bounds.height * CONFIG.TRIANGLE_SPAWN_AREA_Y_FACTOR;
    const spawnY = centerY + (Math.random() - 0.5) * scatterRangeY;

    const color =
        CONFIG.TRIANGLE_COLORS[
            Math.floor(Math.random() * CONFIG.TRIANGLE_COLORS.length)
        ];
    const size =
        Math.random() * (CONFIG.TRIANGLE_SIZE_MAX - CONFIG.TRIANGLE_SIZE_MIN) +
        CONFIG.TRIANGLE_SIZE_MIN;
    const isFilled = Math.random() > 0.5;

    const velocityX =
        (Math.random() - 0.5) * 2 * CONFIG.TRIANGLE_VELOCITY_X_MAX;

    const velocityY =
        Math.random() *
            (CONFIG.TRIANGLE_VELOCITY_Y_MAX - CONFIG.TRIANGLE_VELOCITY_Y_MIN) +
        CONFIG.TRIANGLE_VELOCITY_Y_MIN;

    const rotationSpeed =
        (Math.random() *
            (CONFIG.TRIANGLE_ROTATION_SPEED_MAX -
                CONFIG.TRIANGLE_ROTATION_SPEED_MIN) +
            CONFIG.TRIANGLE_ROTATION_SPEED_MIN) *
        (Math.random() > 0.5 ? 1 : -1);

    const lifetime =
        Math.random() *
            (CONFIG.TRIANGLE_LIFETIME_SECONDS_MAX -
                CONFIG.TRIANGLE_LIFETIME_SECONDS_MIN) +
        CONFIG.TRIANGLE_LIFETIME_SECONDS_MIN;

    const triangle = new TriangleParticle(
        spawnX,
        spawnY,
        color,
        size,
        isFilled,
        velocityX,
        velocityY,
        rotationSpeed,
        lifetime,
        CONFIG.TRIANGLE_FADE_IN_SECONDS
    );
    character.addChild(triangle);
    activeTriangles.push(triangle);
};

interface activeParticleTickerFunctionsInterface {
    activeTriangles: TriangleParticle[];
    particleFunction: ((delta: number) => void) | null;
    lastTriangleSpawnTime: number;
    hologram: HologramLightEffect;
}

const activeParticleTickerList: Record<
    string,
    activeParticleTickerFunctionsInterface | null
> = {};

const particleFunction = (
    delta: number,
    app: PIXI.Application,
    model: Live2DModel<InternalModel>,
    activeTriangles: TriangleParticle[],
    modelkey: string
) => {
    try {
        const now = performance.now();
        if (activeParticleTickerList[modelkey]?.lastTriangleSpawnTime) {
            const lastTriangleSpawnTime =
                activeParticleTickerList[modelkey]?.lastTriangleSpawnTime;
            if (
                now - lastTriangleSpawnTime >
                CONFIG.TRIANGLE_SPAWN_INTERVAL_MS
            ) {
                spawnTriangle(model, activeTriangles);
                activeParticleTickerList[modelkey].lastTriangleSpawnTime = now;
            }
        }

        for (let i = activeTriangles.length - 1; i >= 0; i--) {
            const triangle = activeTriangles[i];
            const expired = triangle.update(delta, app);
            if (expired) {
                app.stage.removeChild(triangle);
                activeTriangles.splice(i, 1);
                triangle.destroy();
            }
        }
    } catch {
        if (activeParticleTickerList[modelkey]?.particleFunction) {
            app.ticker.remove(
                activeParticleTickerList[modelkey]?.particleFunction
            );
            activeParticleTickerList[modelkey].particleFunction = null;
        }
        console.info("Removed the virtual ticker.");
    }
};

export const virtualEffectParticles = (
    model: Live2DModel<InternalModel>,
    modelkey: string,
    app: PIXI.Application,
    show: boolean
) => {
    if (show) {
        const activeTriangles: TriangleParticle[] = [];
        const hologram = spawnHologram(model);
        const lastTriangleSpawnTime = 1;

        const newParticleFunction = (delta: number) => {
            particleFunction(delta, app, model, activeTriangles, modelkey);
        };
        if (
            !activeParticleTickerList[modelkey] ||
            !activeParticleTickerList.particleFunction
        ) {
            activeParticleTickerList[modelkey] = {
                activeTriangles: activeTriangles,
                particleFunction: newParticleFunction,
                lastTriangleSpawnTime: lastTriangleSpawnTime,
                hologram: hologram,
            };
        }

        app.ticker.add(newParticleFunction);
    } else {
        if (activeParticleTickerList[modelkey]?.particleFunction) {
            app.ticker.remove(
                activeParticleTickerList[modelkey].particleFunction
            );
            activeParticleTickerList[modelkey].particleFunction = null;
        }
        if (activeParticleTickerList[modelkey]?.activeTriangles) {
            while (
                activeParticleTickerList[modelkey]?.activeTriangles.length > 0
            ) {
                const triangle =
                    activeParticleTickerList[modelkey]?.activeTriangles.pop();
                if (triangle && triangle.parent) {
                    triangle.parent.removeChild(triangle);
                    triangle.destroy();
                }
            }
        }
        if (activeParticleTickerList[modelkey]?.hologram) {
            const hologram = activeParticleTickerList[modelkey]?.hologram;
            hologram.parent.removeChild(hologram);
            hologram.destroy();
        }

        // if (_particleTickerFunction) {
        //     app.ticker.remove(_particleTickerFunction);
        //     _particleTickerFunction = null;
        // }
    }
};

export const virtualEffectCRT = () => {
    const crtFilter = new CRTFilter({
        time: 2,
        lineWidth: 10,
        lineContrast: 0.1,
        vignetting: 0,
    });
    const animateCRT = () => {
        crtFilter.time += 0.2;
        crtFilter.lineWidth = 7 + 5 * Math.sin(crtFilter.time * 0.01);
        crtFilter.seed = Math.random();
        requestAnimationFrame(animateCRT);
    };

    const adjustmentFilter = new AdjustmentFilter({
        alpha: 0.8,
        brightness: 1.2,
        blue: 1,
        green: 1,
        red: 0.7,
    });

    animateCRT();

    return [crtFilter, adjustmentFilter];
};
