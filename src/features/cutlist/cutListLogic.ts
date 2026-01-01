import { CabinetInput } from "../../types/cabinet";

export function generateCutList(input: CabinetInput) {
    const { width, height, depth, thickness } = input;

    return [
        {
            name: "Side Panels",
            size: `${height} x ${depth}`,
            qty: 2,
        },
        {
            name: "Top / Bottom",
            size: `${width - thickness * 2} x ${depth}`,
            qty: 2,
        },
        {
            name: "Back Panel",
            size: `${width} x ${height}`,
            qty: 1,
        },
    ];
}
