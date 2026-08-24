import { Live2DModel } from "@sekai-world/pixi-live2d-display-mulmotion";
import { BaseTexture, ImageResource, ImageBitmapResource } from "pixi.js";

import type IModel from "../types/IModel";
import { readAsDataURL } from "./FileReader";

// Since the texture must be in two different formats to be displayed in two
// different places - the Live2D renderer requires an ImageBitmap, while the
// preview <img> needs a src URL - the texture swap procedure generates both
// formats up front.
//
// I did try passing the image's data URI into PIXI's renderer to avoid this
// duplication, but it just crashed horribly instead of rendering perfectly
// like it does with a prepared ImageBitmap.
export const applyTextureSwap = async (model: Live2DModel, img: File) => {
    const [bmp, data] = await Promise.all([createImageBitmap(img), readAsDataURL(img)]);
    const newTexture = model.textures[0].clone();
    newTexture.baseTexture = new BaseTexture(new ImageBitmapResource(bmp, {ownsImageBitmap: true}));
    model.textures[0] = newTexture;
    return data;
};

export const currentTextureURL = (outerModel: IModel) => {
    if (outerModel.textureSwap) return outerModel.textureSwap;
    const model = outerModel.model as Live2DModel;
    const resource = model.textures[0].baseTexture.resource as ImageResource;
    return resource.url;
};
