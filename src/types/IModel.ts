import * as PIXI from "pixi.js";
import {
    InternalModel,
    Live2DModel,
} from "@sekai-world/pixi-live2d-display-mulmotion";
import { ILive2DModelData } from "./ILive2DModelData";
import { AdjustmentFilter } from "pixi-filters";
import { IVirtualEffectEntity } from "./IVirtualEffectEntity";

export default interface IModel {
    character: string;
    root: PIXI.Container;
    model: Live2DModel<InternalModel> | PIXI.Sprite;
    modelName: string;
    modelX: number;
    modelY: number;
    modelScale: number;
    modelRotation: number;
    modelBlur: number;
    modelOpacity: number;
    adjustmentFilter: AdjustmentFilter;
    virtualEffect: boolean;
    textureSwap: string | null;
    modelData: ILive2DModelData | undefined;
    expression: number;
    pose: number;
    idle: boolean;
    visible: boolean;
    from: string;
    parametersChanged: Record<string, number>;
    virtualEffectEntity: IVirtualEffectEntity | null;
}
