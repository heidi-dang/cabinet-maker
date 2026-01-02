import { DrawerConfig } from "./types";

export function calculateDrawerBox(config: DrawerConfig) {
    const {
        openingWidth,
        openingHeight,
        openingDepth,
        slideClearance,
    } = config;

    return {
        width: Math.round(openingWidth - slideClearance),
        height: Math.round(openingHeight - 12.7),
        depth: Math.round(openingDepth),
    };
}
