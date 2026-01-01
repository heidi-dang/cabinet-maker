type Input = {
    width: number;      // mm
    height: number;     // mm
    depth: number;      // mm
    thickness: number; // mm
    doors?: number;    // count
    doorGap?: number;  // mm
    back?: boolean;
};

type CutItem = {
    name: string;
    size: string;
    qty: number;
};

export function generateCutList(input: Input): CutItem[] {
    const {
        width,
        height,
        depth,
        thickness,
        doors = 0,
        doorGap = 2,
        back = true,
    } = input;

    const cuts: CutItem[] = [];

    // --------------------
    // CARCASS
    // --------------------
    cuts.push({
        name: "Side panel",
        size: `${height} × ${depth}`,
        qty: 2,
    });

    cuts.push({
        name: "Top panel",
        size: `${width - thickness * 2} × ${depth}`,
        qty: 1,
    });

    cuts.push({
        name: "Bottom panel",
        size: `${width - thickness * 2} × ${depth}`,
        qty: 1,
    });

    if (back) {
        cuts.push({
            name: "Back panel",
            size: `${width} × ${height}`,
            qty: 1,
        });
    }

    // --------------------
    // DOORS (PARAMETRIC)
    // --------------------
    if (doors > 0) {
        const totalGap = doorGap * (doors + 1);
        const doorWidth = Math.floor((width - totalGap) / doors);

        cuts.push({
            name: `Door`,
            size: `${height} × ${doorWidth}`,
            qty: doors,
        });
    }

    return cuts;
}
