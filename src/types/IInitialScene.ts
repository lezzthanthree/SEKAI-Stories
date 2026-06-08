export interface InitialScene {
    background: string;
    text: string;
    nameTag: string;
    modelX: number;
    modelY: number;
    modelScale?: number;
    pngName: string;
    sceneText: string;
    sceneTextVariant?: string;
    sceneTextEnabled?: boolean;
    choices?: {
        choice1: string;
        choice2: string;
    };
    choicesEnabled?: boolean;
}
