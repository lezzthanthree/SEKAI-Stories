import { ILighting } from "./ILighting";

/* 
    Why the nulls?
        > SEKAISCENE files are constantly being updated. I don't want old files to fail all because of one property.
*/

export interface IJsonSave {
    lastModified: string;
    background: string;
    splitBackground: {
        first: string;
        second: string;
    };
    lighting: ILighting;
    text: {
        nameTag: string;
        dialogue: string;
    };
    sceneText?: string;
    choicesText?: {
        first?: string;
        second?: string;
    };
    models: {
        from: string;
        character: string;
        modelName: string;
        modelTransform?: {
            x?: number;
            y?: number;
            scale?: number;
            rotation?: number;
            blur?: number;
            opacity?: number;
        };
        modelExpression?: number;
        modelPose?: number;
        modelParametersChanged: Record<string, number> | undefined;
        modelIdle: boolean;
    }[];
}
