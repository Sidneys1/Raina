export const BUILD_TYPE = 'debug';

export const DEBUG_FONT = "12pt monospace";
export const BUTTON_FONT = '12pt sans-serif';
export const MAIN_MENU_FONT = '50px sans-serif';
export const LOADING_FONT = '20px sans-serif';

export const RAIN_HEIGHT = 250;

export enum AssetType {
    Image,
}
export const REQUIRED_ASSETS: [AssetType, string][] = [
    [AssetType.Image, 'splash.svg'],
];
export const ASSETS: [AssetType, string][] = [
    [AssetType.Image, 'raina.svg'],
    [AssetType.Image, 'raina_dark.svg'],
    [AssetType.Image, 'raina_darker.svg'],
    [AssetType.Image, 'raina_darkest.svg'],
    [AssetType.Image, 'raina_face.svg'],
    [AssetType.Image, 'raina_face_o.svg'],
    [AssetType.Image, 'bg.svg'],
    [AssetType.Image, 'shadow.svg'],
    [AssetType.Image, 'game_over_splash.svg'],
    [AssetType.Image, 'flower_1.svg'],
    [AssetType.Image, 'flower_2.svg'],
    [AssetType.Image, 'flower_3.svg'],
];
