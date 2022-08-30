import { IGame } from "../Interfaces.js";
import { GameState } from "./Base.js";
import { InGameState } from "./InGameState.js";
import { Renderer } from "../Renderer.js";
import { Button } from "../entities/Button.js";
import { Point, PointMath } from "../Types.js";
import { AssetManager } from "../modules/AssetManager.js";

const GAME_OVER_FONT = "24pt sans-serif";
const SCORE_FONT = "12pt sans-serif";

export class GameOverState extends GameState {
    public Name = "Loading";

    private readonly _game: IGame;
    private readonly _game_over_pos: Point;
    private readonly _score_text: string;
    private readonly _score_pos: Point;
    private readonly _logo: HTMLImageElement;
    
    constructor(game: IGame, score: number) { 
        super(); 

        this._game = game;
        this._score_text = `Score: ${score.toFixed(0)}`;
        this._logo = AssetManager.GetImage('game_over_splash.svg');

        let font_size = Renderer.MeasureText(GAME_OVER_FONT, "GAME OVER");
        const center: Point = [Renderer.Width / 2, Renderer.Height / 2];
        this._game_over_pos = PointMath.add(PointMath.sub(center, PointMath.div([font_size.width, font_size.actualBoundingBoxDescent], 2)), [0, 50]);
        font_size = Renderer.MeasureText(SCORE_FONT, this._score_text);
        this._score_pos = PointMath.add(PointMath.sub(center, PointMath.div([font_size.width, font_size.actualBoundingBoxDescent], 2)), [0, 75]);

        this.AddEntity(new Button('Play Again?', PointMath.sub(center, [50, -100]), [100, 26], () => {
            this._game.SetState(new InGameState(this._game));
        }));
    }
    
    override Draw(elapsedTime: number): void {
        Renderer.Clear('white');
        
        Renderer.DrawImage(this._logo, 0, 0);

        Renderer.DrawText("black", GAME_OVER_FONT, ...this._game_over_pos, 'GAME OVER');
        Renderer.DrawText("black", SCORE_FONT, ...this._score_pos, this._score_text);

        super.Draw(elapsedTime);
    }
}