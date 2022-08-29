export const BUILD_TYPE = 'debug';

export const DEBUG_FONT = "12pt monospace";
export const BUTTON_FONT = '12pt sans-serif';
export const MAIN_MENU_FONT = '50px sans-serif';
export const LOADING_FONT = '20px sans-serif';

export const PLAYER_SPEED = 150;
export const COW_SPEED = 25;

export enum AssetType {
    Image,
}
export const REQUIRED_ASSETS: [AssetType, string][] = [
    [AssetType.Image, 'logo.png'],
];
export const ASSETS: [AssetType, string][] = [
    [AssetType.Image, 'raina.svg'],
];
