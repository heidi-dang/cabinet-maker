import { CabinetInput, Panel } from "./types";
import { calculateDrawerBox } from "./calculateDrawerBox";
import { calculateFingerPull } from "./calculateFingerPull";
import { calculateDrawerFrontHeights } from "./calculateDrawerStack";

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

    if (type === "DRAWER" && input.drawerConfig && input.drawerStack) {
        const drawerBox = calculateDrawerBox(input.drawerConfig);
        const fronts = calculateDrawerFrontHeights(
            input.drawerConfig.openingHeight,
            input.drawerStack
        );

        const panels = [];

        fronts.forEach(front => {
            const fingerPull = calculateFingerPull(width);

            panels.push(
                {
                    name: `Drawer ${front.index} – Front Panel`,
                    width: width,
                    height: front.frontHeight,
                    quantity: 1,
                },
                {
                    name: `Drawer ${front.index} – Box Side`,
                    width: drawerBox.depth - 20,
                    height: front.frontHeight - 20,
                    quantity: 2,
                },
                {
                    name: `Drawer ${front.index} – Box Front`,
                    width: drawerBox.width,
                    height: front.frontHeight - 20,
                    quantity: 1,
                },
                {
                    name: `Drawer ${front.index} – Box Back`,
                    width: drawerBox.width,
                    height: front.frontHeight - 20,
                    quantity: 1,
                },
                {
                    name: `Drawer ${front.index} – Box Bottom`,
                    width: drawerBox.width,
                    height: drawerBox.depth - 20,
                    quantity: 1,
                },
                {
                    name: `Drawer ${front.index} – Finger Pull Length`,
                    width: fingerPull.length,
                    height: 0,
                    quantity: 1,
                },
                {
                    name: `Drawer ${front.index} – Finger Pull Offset`,
                    width: fingerPull.offsetFromLeft,
                    height: 0,
                    quantity: 1,
                }
            );
        });

        return panels;
    }


    return [];
}
