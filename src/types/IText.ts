import * as PIXI from "pixi.js";

export default interface IText {
    textContainer: PIXI.Container;
    type: {
        default: PIXI.Container;
        classic: PIXI.Container;
        mySekai: PIXI.Container;
        ddlc: PIXI.Container;
    };
    nameTag: PIXI.Text[];
    dialogue: PIXI.Text[];
    nameTagString: string;
    dialogueString: string;
    yOffset: number;
    fontSize: number;
    visible: boolean;
    hideEverything: boolean;
    typeSelected: string;
}
