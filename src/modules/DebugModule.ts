import { IGame } from '../Interfaces.js'
import { DrawableGameModule } from "../GameModule.js";
import { DEBUG_FONT } from '../Constants.js';
import { Point } from '../Types.js';
import { Renderer } from '../Renderer.js';
import { InputManager } from './InputManager.js';

export class DebugModule extends DrawableGameModule {
    Fps: number = NaN;

    private _game: IGame;
    private totalFrames: number = 0;
    private elapsedTime: number = 0;
    private textHeight: number;
    
    constructor(game: IGame) {
        super(true, -9999, -9999);

        this._game = game;

        this.textHeight = 10 + Renderer.MeasureText(DEBUG_FONT, "0").actualBoundingBoxAscent;
    }

    Draw(_: number): void {
        this.totalFrames++;

        const ctx = Renderer.Ctx;
        ctx.save();
        ctx.setLineDash([5, 5])
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();

        for (let x = 12; x < 1280;) {
            ctx.moveTo(x, -25);
            ctx.lineTo(x, 745);
            x += 25;
            ctx.moveTo(x, 745);
            ctx.lineTo(x, -25);
            x += 25;
        }

        for (let y = 12; y < 720;) {
            ctx.moveTo(-25, y);
            ctx.lineTo(1305, y);
            y += 25;
            ctx.moveTo(1305, y);
            ctx.lineTo(-25, y);
            y += 25;
        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.restore()

        // let player: Player|undefined = undefined;
        for (const entity of this._game.State?.Entities ?? []) {
            Renderer.FillCircle('red', entity.Pos[0], entity.Pos[1], 5);
        }

        Renderer.DrawText("black", DEBUG_FONT, 10, this.textHeight, `${this.Fps} fps`);

        Renderer.DrawText("black", DEBUG_FONT, 10, this.textHeight * 2, "Stage: " + (this._game.State?.Name || "None"));

        Renderer.DrawText("black", DEBUG_FONT, 10, this.textHeight * 3, "Keys: " + InputManager.S.Keys().join(', '));

        const mouse = InputManager.S.MousePos();
        Renderer.DrawText("black", DEBUG_FONT, 10, this.textHeight * 4, `Mouse: ${mouse[0]},${mouse[1]} (${(mouse[0] / 25).toFixed(2)},${(mouse[1] / 25).toFixed(2)}) ` + InputManager.S.MouseButtons().join(', '));

        // if (player !== undefined)
        //     Renderer.DrawText("black", DEBUG_FONT, 10, this.textHeight * 5, `Player: ${(player.Pos[0] / 25).toFixed(2)},${(player.Pos[1] / 25).toFixed(2)}`);
    }
    
    Update(elapsedTime: number): void {
        this.elapsedTime += elapsedTime;

        if (this.elapsedTime >= 1) {
            this.Fps = Math.round((this.totalFrames / this.elapsedTime) * 100) / 100;
            this.totalFrames = 0;
            this.elapsedTime = 0;
        }

        if (InputManager.S.KeyWentDown('F3')) {
            this.Enabled = false;
        }
    }

    public override DisabledUpdate(elapsedTime: number): void {
        if (InputManager.S.KeyWentDown('F3')) {
            this.Enabled = true;
        }
    }
}