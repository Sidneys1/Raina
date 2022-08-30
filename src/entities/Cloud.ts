import { RAIN_HEIGHT } from "../Constants.js";
import { AssetManager } from "../modules/AssetManager.js";
import { Renderer } from "../Renderer.js";
import { InGameState } from "../states/InGameState.js";
import { Point, PointMath } from "../Types.js";
import { Entity } from "./Base.js";

const SLOW_FOLLOW = 25;
const SHADOW_SIZE: Point = [75, 27];

export class Cloud extends Entity {
    private Sprite: HTMLImageElement;
    private Shadow: HTMLImageElement;
    private ShadowOffset: Point = [-(75/2), -(27/2)]
    private Speed: Point = [-(0.25 + Math.random() / 2), (Math.random() - 0.25) / 4];
    public Strength: number = 15 + Math.random() * 35;

    constructor() {
        super([850, 400], [75, 50]);

        this.DrawOffset = [0, -RAIN_HEIGHT];

        this.Sprite = AssetManager.GetImage('raina.svg');
        this.Shadow = AssetManager.GetImage('shadow.svg');
    }

    Update(elapsedTime: number): void {
        this.Pos = PointMath.add(this.Pos, this.Speed);
    }

    Draw(elapsedTime: number): void {
        Renderer.Ctx.save();
        Renderer.Ctx.translate(...PointMath.add(this.Pos, this.DrawOffset));
        Renderer.Ctx.rotate(this.Speed[0] * (Math.PI / 180));
        /* Draw the cloud! */ {
            Renderer.DrawImage(this.Sprite, -(75 / 2), 0, ...this.Size, 0.5);
        }
        Renderer.Ctx.restore();

        Renderer.DrawImage(this.Shadow, ...PointMath.add(this.Pos, this.ShadowOffset), ...SHADOW_SIZE, 0.5);
    }

}
