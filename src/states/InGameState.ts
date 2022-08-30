import { Cloud } from "../entities/Cloud.js";
import { Plant } from "../entities/Plant.js";
import { Raina } from "../entities/Raina.js";
import { Rainfall } from "../entities/Rainfall.js";
import { IGame } from "../Interfaces.js";
import { AssetManager } from "../modules/AssetManager.js";
import { DebugModule } from "../modules/DebugModule.js";
import { InputManager } from "../modules/InputManager.js";
import { Renderer } from "../Renderer.js";
import { Point, PointMath } from "../Types.js";
import { GameState } from "./Base.js";
import { GameOverState } from "./GameOverState.js";

const INGAME_SCORE_FONT = '24pt Impact';

export class InGameState extends GameState {
    private Background: HTMLImageElement;
    public Name = "In-Game";
    private Plants: Plant[] = [];
    private readonly Raina: Raina;
    private Score = 0;

    private cloudSleep = 2;
    private clouds: Cloud[] = [];

    private readonly _game: IGame;

    public Temperature = 1;

    constructor(game: IGame) { 
        super();

        this._game = game;

        this.Background = AssetManager.GetImage('bg.svg');

       this.Raina = new Raina(this);
        this.AddEntity(this.Raina);

        for (let y = 0; y < 7; y++) {
            for (let x = 0; x < 7; x++) {
                const plant = new Plant([x * 75 + 137, y * 45 + 275], this);
                this.Plants.push(plant);
                this.AddEntity(plant);
            }
        }

        this.UpdateDrawables();
        this.UpdateUpdateables();

        DebugModule.S?.Extras.push(() => {
            const mouse = InputManager.S.MousePos();
            const mod = this.PosToPlant(mouse);
            if (mod === undefined) return 'Plant: undefined';
            try {
                const plant = this.Plants[mod[0] + mod[1] * 7];
                return `Plant: ${mod[0]},${mod[1]} - ${plant?.Health}`;
            } catch (e) {
                throw `${mod[0]},${mod[1]}`;
            }
        });

        DebugModule.S?.Extras.push(() => `Next cloud in ${this.cloudSleep.toFixed(1)}s`);
        DebugModule.S?.Extras.push(() => `Score: ${this.Score.toFixed(2)}`);
        DebugModule.S?.Extras.push(() => `Temp: ${this.Temperature.toFixed(2)}`);
    }

    private PosToPlant(pos: Point): Point | undefined {
        if (pos[0] < 137 || pos[0] > 675 || pos[1] < 275 || pos[1] > 590) return undefined;
        return [Math.floor((pos[0] - 137) / 75), Math.floor((pos[1] - 275) / 45)];
    }

    public override Update(elapsedTime: number): void {
        super.Update(elapsedTime);

        this.Temperature += elapsedTime / 100;
        
        for (let i = 0; i < this.Entities.length; i++) {
            const rain = this.Entities[i];
            if (!(rain instanceof Rainfall)) continue;

            if (!rain.Enabled) {
                this.RemoveEntity(rain);
                const plantPos = this.PosToPlant(rain.Pos);
                if (plantPos === undefined) continue;
                const plant = this.Plants[plantPos[0] + plantPos[1] * 7];
                if (plant?.Health <= 0) continue;
                plant.Health = Math.min(30, plant.Health + rain.Amount);
            }
        }

        this.cloudSleep -= elapsedTime;
        if (this.cloudSleep < 0) {
            this.cloudSleep = 10 + Math.random() * 20;

            const cloud = new Cloud();
            this.clouds.push(cloud);
            this.AddEntity(cloud);
        }

        for (let i = 0; i < this.clouds.length; i++) {
            const cloud = this.clouds[i];
            if (cloud.Pos[0] < -50) {
                this.RemoveEntity(cloud);
                this.clouds = this.clouds.filter(e => e !== cloud);
            } else if (PointMath.Length(PointMath.sub(this.Raina.Pos, cloud.Pos)) < 50) {
                this.Raina.Strength += cloud.Strength;
                this.RemoveEntity(cloud);
                this.clouds = this.clouds.filter(e => e !== cloud);
                this.Raina.OFaceTimer = 3;
            }
        }
        this.Score += (this.Plants.reduce<number>((p, c) => p + c.Health, 0) * elapsedTime) / 10;

        if (this.Plants.filter(p => p.Health).length === 0) {
            this._game.SetState(new GameOverState(this._game, this.Score));
        }
    }

    public override Draw(elapsedTime: number): void {
        Renderer.DrawImage(this.Background, 0, 0);

        Renderer.DrawText('black', INGAME_SCORE_FONT, 10, 50, `Score: ${this.Score.toFixed(0)}`);

        super.Draw(elapsedTime);
    }

    AddRain(Pos: Point, amount: number) {
        const rain = new Rainfall(amount);
        rain.Pos = Pos;

        this.AddEntity(rain);
        this.UpdateDrawables();
    }
}