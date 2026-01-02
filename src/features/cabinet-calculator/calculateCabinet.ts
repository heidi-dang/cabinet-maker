import { CabinetInput, Panel } from "./types";
import { calculateDrawerBox } from "./calculateDrawerBox";
import { calculateFingerPull } from "./calculateFingerPull";

export function calculateCabinet(input: CabinetInput): Panel[] {
    const { type, width, height, depth, thickness } = input;

    const commonPanels: Panel[] = [
        {
            name: "Side Panels",
            width: depth,
            height: height,
            quantity: 2,
        },
        {
            name: "Top Panel",
            width: width - thickness * 2,
            height: depth,
            quantity: 1,
        },
        {
            name: "Bottom Panel",
            width: width - thickness * 2,
            height: depth,
            quantity: 1,
        },
    ];

    if (type === "BASE") {
        return [
            ...commonPanels,
            {
                name: "Back Panel",
                width: width,
                height: height,
                quantity: 1,
            },
            {
                name: "Kickboard",
                width: width,
                height: 150,
                quantity: 1,
            },
        ];
    }

    if (type === "WALL") {
        return [
            ...commonPanels,
            {
                name: "Back Panel",
                width: width,
                height: height,
                quantity: 1,
            },
        ];
    }

    if (type === "DRAWER" && input.drawerConfig) {
        const drawerBox = calculateDrawerBox(input.drawerConfig);
        const fingerPull = calculateFingerPull(width);

        return [
            {
                name: "Drawer Side Panels",
                width: drawerBox.depth - 20,
                height: drawerBox.height,
                quantity: 2,
            },
            {
                name: "Drawer Front (Internal)",
                width: drawerBox.width,
                height: drawerBox.height,
                quantity: 1,
            },
            {
                name: "Drawer Back",
                width: drawerBox.width,
                height: drawerBox.height,
                quantity: 1,
            },
            {
                name: "Drawer Bottom",
                width: drawerBox.width,
                height: drawerBox.depth - 20,
                quantity: 1,
            },
            {
                name: "Finger Pull Length (mm)",
                width: fingerPull.length,
                height: 0,
                quantity: 1,
            },
            {
                name: "Finger Pull Offset From Left (mm)",
                width: fingerPull.offsetFromLeft,
                height: 0,
                quantity: 1,
            },
        ];
    }

    return [];
}
