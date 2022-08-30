import { RAIN_HEIGHT } from "../Constants.js";
import { InputManager } from "../modules/InputManager.js";
import { Renderer } from "../Renderer.js";
import { Point, PointMath } from "../Types.js";
import { Entity } from "./Base.js";

const RAIN_SPEED = 300;

export class Rainfall extends Entity {
    private Raindrops: Point[] = [];
    public readonly Amount: number;

    constructor(amount: number) {
        super([0,0], [50, 50]);

        this.DrawOffset = [-(75 / 2), -(RAIN_HEIGHT - 70)];

        this.Amount = amount;

        const count = 1 + Math.floor(Math.random() * amount);
        for (let i = 0; i < count; i++)
            this.Raindrops.push([Math.random() * 75, Math.random() * 50 - 50]);
    }

    Update(elapsedTime: number): void {
        this.DrawOffset[0] += elapsedTime * 10;
        this.DrawOffset[1] += elapsedTime * RAIN_SPEED;
        if (this.DrawOffset[1] >= 0)
            this.Enabled = false;
    }

    Draw(elapsedTime: number): void {
        const reference = PointMath.add(this.Pos, this.DrawOffset);
        for (const drop of this.Raindrops) {
            Renderer.DrawLine('blue', ...PointMath.add(reference, drop), ...PointMath.add(reference, PointMath.add(drop, [2, 15])));
        }
        // Renderer.DrawImage(this.Sprite, ...PointMath.add(this.Pos, this.DrawOffset));
    }

}