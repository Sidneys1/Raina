import { AssetManager } from "../modules/AssetManager.js";
import { Renderer } from "../Renderer.js";
import { InGameState } from "../states/InGameState.js";
import { Point, PointMath } from "../Types.js";
import { Entity } from "./Base.js";

export class Plant extends Entity {
    // private Sprite: HTMLImageElement;
    public Health = 30;
    private Speed = Math.random() / 4 + 0.5;

    private readonly _game: InGameState;
    private readonly _image1: HTMLImageElement;
    private readonly _image2: HTMLImageElement;
    private readonly _image3: HTMLImageElement;

    // private readonly _image_pos: Point;

    constructor(pos: Point, game: InGameState) {
        super(pos, [50, 30]);

        this._game = game;
        this._image1 = AssetManager.GetImage('flower_1.svg')
        this._image2 = AssetManager.GetImage('flower_2.svg')
        this._image3 = AssetManager.GetImage('flower_3.svg')

        // this._image_pos = PointMath.sub(this.Pos, [0, 45]);
    }

    Update(elapsedTime: number): void {
        this.Health -= elapsedTime * this.Speed * this._game.Temperature;
        if (this.Health < 0) this.Health = 0;
    }

    Draw(elapsedTime: number): void {
        if (this.Health == 0) return;
        // Renderer.DrawText(this.Health < 10 ? 'red' : (this.Health < 20 ? 'orange' : 'black'), 'sans-serif', ...PointMath.add(this.Pos, [12, 15]), this.Health.toFixed(0));
        
        let image = this._image1;
        if (this.Health < 10) image = this._image3;
        else if (this.Health < 20) image = this._image2;

        Renderer.DrawImage(image, ...this.Pos, 75, 45);
        // Renderer.DrawRect('black', ...this.Pos, ...this.Size);
    }

}
