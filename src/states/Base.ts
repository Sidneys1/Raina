import { IDrawable, IGameCommon, IUpdatable } from "../Interfaces.js";
import { Entity } from "../entities/Base.js";
import { GameCommon } from "../GameCommon.js";


export abstract class GameState extends GameCommon implements IGameCommon, IUpdatable, IDrawable {
    public abstract Name: string;
    public Entities: Entity[] = [];
    DrawPriority: number = 0;
    Enabled: boolean = true;
    Priority: number = 0;
    Layer: number = 0;

    constructor() { super(); }
    DisabledUpdate(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }


    public Update(elapsedTime: number) {
        for (const updatable of this.Updatables)
            updatable.Enabled ? updatable.Update(elapsedTime) : updatable.DisabledUpdate(elapsedTime);
    }

    public Draw(elapsedTime: number) {
        let maxlayer = 0;
        for (let layer = 0; layer <= maxlayer; layer++) {
            // console.debug(`Drawing layer ${layer}`);
            for (const drawable of this.Drawables) {
                if (!drawable.Enabled) continue;
                if (drawable.Layer > maxlayer) maxlayer = drawable.Layer;
                if (drawable.Layer === layer)
                    drawable.Draw(elapsedTime);
            }
        }
    }
}
