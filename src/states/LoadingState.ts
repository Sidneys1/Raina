import { IGame } from "../Interfaces.js";
import { BUTTON_FONT, LOADING_FONT } from "../Constants.js";
import { GameState } from "./Base.js";
import { InGameState } from "./InGameState.js";
import { Renderer } from "../Renderer.js";
import { AssetManager } from "../modules/AssetManager.js";
import { Button } from "../entities/Button.js";
import { GameOverState } from "./GameOverState.js";



export class LoadingState extends GameState {
    public Name = "Loading";

    private _game: IGame;
    private loading = true;
    private logo: HTMLImageElement;
    
    constructor(game: IGame) { 
        super(); 

        this._game = game;

        this.logo = AssetManager.GetImage('splash.svg');
        AssetManager.LoadAllAssets().then(() => {
            this.loading = false;
            const startButton = new Button('Play', [Renderer.Width / 2 - 100, Renderer.Height / 2 - 12], [200, 50], () => {
                this._game.SetState(new InGameState(this._game));
                // this._game.SetState(new GameOverState(this._game, 1337));
            });
            startButton.Font = '24pt sans-serif';
            this.AddEntity(startButton);
        });
    }
    
    override Draw(elapsedTime: number): void {
        Renderer.Clear('white');
        Renderer.DrawImage(this.logo, 0, 0);
        
        if (this.loading) {
            const halfHeight = Renderer.Height / 2;
            const halfWidth = Renderer.Width / 2;
            const progress = AssetManager.Progress();
            const text = progress >= 1 ? 'Loading... Done!' : `Loading... ${Number(progress).toLocaleString(undefined, {style: 'percent', maximumFractionDigits: 0})}`;
            const width = Renderer.MeasureText(LOADING_FONT, text).width;
            Renderer.DrawText('black', LOADING_FONT, halfWidth - (width / 2), halfHeight, text);
        }

        super.Draw(elapsedTime);
    }
}