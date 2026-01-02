import { CabinetInput, Panel } from "./types";

export function calculateCabinet(input: CabinetInput): Panel[] {
    const { width, height, depth, thickness } = input;

    return [
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
        {
            name: "Back Panel",
            width: width,
            height: height,
            quantity: 1,
        },
    ];
}
