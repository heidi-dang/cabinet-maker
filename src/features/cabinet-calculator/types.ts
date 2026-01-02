export type CabinetType = "BASE" | "WALL" | "DRAWER";

export type DrawerConfig = {
    openingWidth: number;
    openingHeight: number;
    openingDepth: number;
    slideClearance: number; // total mm (default 25.4)
};

export type FingerPull = {
    length: number;
    offsetFromLeft: number;
};

export type CabinetInput = {
    type: CabinetType;
    width: number;
    height: number;
    depth: number;
    thickness: number;

    // drawer-only
    drawerConfig?: DrawerConfig;
};

export type Panel = {
    name: string;
    width: number;
    height: number;
    quantity: number;
};

export type DrawerStackConfig = {
    drawerCount: number;
    verticalGap: number; // mm, e.g. 2
};

export type DrawerFront = {
    index: number;
    frontHeight: number;
    fingerPullLength: number;
    fingerPullOffset: number;
};