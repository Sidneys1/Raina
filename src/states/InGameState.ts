import { GameState } from "./Base.js";

export class InGameState extends GameState {
    public Name = "In-Game";

    constructor() { 
        super();

        this.UpdateDrawables();
        this.UpdateUpdateables();
    }
}