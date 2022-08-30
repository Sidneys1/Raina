import { RAIN_HEIGHT } from "../Constants.js";
import { AssetManager } from "../modules/AssetManager.js";
import { DebugModule } from "../modules/DebugModule.js";
import { InputManager } from "../modules/InputManager.js";
import { Renderer } from "../Renderer.js";
import { InGameState } from "../states/InGameState.js";
import { Point, PointMath } from "../Types.js";
import { Entity } from "./Base.js";

const SLOW_FOLLOW = 25;

export class Raina extends Entity {
    private Sprite: HTMLImageElement;
    private SpriteDark: HTMLImageElement;
    private SpriteDarker: HTMLImageElement;
    private SpriteDarkest: HTMLImageElement;

    private SpriteFace: HTMLImageElement;
    private SpriteFaceO: HTMLImageElement;
    
    private Shadow: HTMLImageElement;
    private ShadowOffset: Point = [-(75/2), -(27/2)]
    private State: InGameState;
    private Cooldown = 0;
    private Speed: Point = [0, 0];
    public Strength: number = 30;

    public OFaceTimer = 0;

    constructor(state: InGameState) {
        super([400, 300], [75, 50]);

        this.DrawPriority = -9;

        this.State = state;

        this.DrawOffset = [0, -RAIN_HEIGHT];

        this.Sprite = AssetManager.GetImage('raina.svg');
        this.SpriteDark = AssetManager.GetImage('raina_dark.svg');
        this.SpriteDarker = AssetManager.GetImage('raina_darker.svg');
        this.SpriteDarkest = AssetManager.GetImage('raina_darkest.svg');

        this.SpriteFace = AssetManager.GetImage('raina_face.svg');
        this.SpriteFaceO = AssetManager.GetImage('raina_face_o.svg');
        this.Shadow = AssetManager.GetImage('shadow.svg');

        DebugModule.S?.Extras.push(() => `Strength: ${this.Strength.toFixed(0)}`);
    }

    Update(elapsedTime: number): void {
        const targetPos = InputManager.S.MousePos();
        targetPos[1] = Math.max(300, targetPos[1]);
        this.Speed = PointMath.div(PointMath.sub(targetPos, this.Pos), SLOW_FOLLOW);
        this.Pos = PointMath.add(this.Pos, this.Speed);

        this.Cooldown -= elapsedTime;
        this.Strength = Math.max(0, this.Strength - elapsedTime);
        if (this.Cooldown <= 0) {
            this.Cooldown += 0.05;
            this.State.AddRain(this.Pos, Math.floor(this.Strength / 10));
        }

        this.OFaceTimer = Math.max(0, this.OFaceTimer - elapsedTime);
    }

    Draw(elapsedTime: number): void {
        Renderer.Ctx.save();
        Renderer.Ctx.translate(...PointMath.add(this.Pos, this.DrawOffset));
        Renderer.Ctx.rotate(this.Speed[0] * 2 * (Math.PI / 180));
        let sprite = this.Sprite;
        if (this.Strength > 60) sprite = this.SpriteDarkest;
        else if (this.Strength > 40) sprite = this.SpriteDarker;
        if (this.Strength > 20) sprite = this.SpriteDark;
        /* Draw Raina! */ {
            Renderer.DrawImage(sprite, -(75 / 2), 0);
            Renderer.DrawImage(this.OFaceTimer ? this.SpriteFaceO : this.SpriteFace, -(75 / 2), 0);
        }
        Renderer.Ctx.restore();

        Renderer.DrawImage(this.Shadow, ...PointMath.add(this.Pos, this.ShadowOffset));
    }

}
