import { IGame } from "../Interfaces.js";
import { LOADING_FONT } from "../Constants.js";
import { GameState } from "./Base.js";
import { InGameState } from "./InGameState.js";
import { Renderer } from "../Renderer.js";
import { AssetManager } from "../modules/AssetManager.js";



export class LoadingState extends GameState {
    public Name = "Loading";

    private _game: IGame;
    private loading = false;
    private logo: HTMLImageElement;
    
    constructor(game: IGame) { 
        super(); 

        this._game = game;

        this.logo = AssetManager.GetImage('logo.png');
    }
    
    protected ThisUpdate(elapsedTime: number): void {
        if (this.loading) return;
        AssetManager.LoadAllAssets().then(() => {
            this._game.SetState(new InGameState());
        });
        this.loading = true;
    }
    protected ThisDraw(elapsedTime: number): void {
        Renderer.Clear('white');
        const halfHeight = Renderer.Height / 2;
        const halfWidth = Renderer.Width / 2;
        Renderer.DrawImage(this.logo, halfWidth - (545 / 2), halfHeight - 200);

        const progress = AssetManager.Progress();
        const text = progress >= 1 ? 'Loading... Done!' : `Loading... ${Number(progress).toLocaleString(undefined, {style: 'percent', maximumFractionDigits: 0})}`;
        const width = Renderer.MeasureText(LOADING_FONT, text).width;
        Renderer.DrawText('black', LOADING_FONT, halfWidth - (width / 2), halfHeight, text);
    }
}