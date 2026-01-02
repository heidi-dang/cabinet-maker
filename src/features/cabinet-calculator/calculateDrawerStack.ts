import { DrawerStackConfig } from "./types";

export function calculateDrawerFrontHeights(
    openingHeight: number,
    config: DrawerStackConfig
) {
    const { drawerCount, verticalGap } = config;

    const totalGap = verticalGap * (drawerCount - 1);
    const usableHeight = openingHeight - totalGap;

    const singleFrontHeight = Math.floor(usableHeight / drawerCount);

    return Array.from({ length: drawerCount }, (_, i) => ({
        index: i + 1,
        frontHeight: singleFrontHeight,
    }));
}
