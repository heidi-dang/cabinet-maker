import { Group, Object3D } from "three";
import { createBox } from "../../common/3d/utils";

export type BoxType = "TypeA" | "TypeB";

export type CabinetModel = {
    width: number,
    height: number,
    depth: number,
    thickness: number,
    boxType: BoxType,
    backSide: "" | BoxType,
    verticalDividers: number,
    horizontalDividers: number,
    dividersType: BoxType
}

export function createCabinetModel(model: CabinetModel, fill: number, stroke: number): Object3D {
    const { width, height, depth, thickness, boxType, backSide, verticalDividers, horizontalDividers, dividersType } = model;
    const { innerW, innerH, cellW, cellH } = calcCabinetStats(model);

    const g = new Group();

    const panelW = boxType == "TypeA" ? innerW : width;
    const panelH = boxType == "TypeB" ? innerH : height;
    let divDepth = depth;
    let sideDepth = depth;

    if (backSide == "TypeA") {
        const back = createBox(width, height, thickness, fill, stroke);
        back.translateZ(-(depth) / 2);
        g.add(back);
        sideDepth -= thickness;
        divDepth -= thickness;
    } else if (backSide == "TypeB") {
        const back = createBox(innerW, innerH, thickness, fill, stroke);
        back.translateZ(-(depth - thickness) / 2);
        g.add(back);
        divDepth -= thickness;
    }

    const left = createBox(thickness, panelH, sideDepth, fill, stroke);
    const right = createBox(thickness, panelH, sideDepth, fill, stroke);
    const top = createBox(panelW, thickness, sideDepth, fill, stroke);
    const bottom = createBox(panelW, thickness, sideDepth, fill, stroke);

    left.translateX(-(width - thickness) / 2);
    right.translateX((width - thickness) / 2);
    top.translateY(-(height - thickness) / 2);
    bottom.translateY((height - thickness) / 2);

    g.add(left, right, top, bottom);

    if (dividersType == "TypeA") {
        for (let x = 0; x < verticalDividers; x++) {
            const d = createBox(thickness, innerH, divDepth, fill, stroke);
            d.translateX((x + 1) * cellW + x * thickness + thickness / 2 - (innerW / 2));
            g.add(d);
        }

        for (let y = 0; y < horizontalDividers; y++) {
            for (let x = 0; x < verticalDividers + 1; x++) {
                const d = createBox(cellW, thickness, divDepth, fill, stroke);
                d.translateX(x * (cellW + thickness) + cellW / 2 - (innerW / 2));
                d.translateY((y + 1) * cellH + y * thickness + thickness / 2 - (innerH / 2));
                g.add(d);
            }
        }
    }
    else if (dividersType == "TypeB") {
        for (let y = 0; y < horizontalDividers; y++) {
            const d = createBox(innerW, thickness, divDepth, fill, stroke);
            d.translateY((y + 1) * cellH + y * thickness + thickness / 2 - (innerH / 2));
            g.add(d);
        }

        for (let x = 0; x < verticalDividers; x++) {
            for (let y = 0; y < horizontalDividers + 1; y++) {
                const d = createBox(thickness, cellH, divDepth, fill, stroke);
                d.translateX((x + 1) * (cellW + thickness) - (innerW + thickness) / 2);
                d.translateY(y * (cellH + thickness) - (innerH - cellH) / 2);
                g.add(d);
            }
        }
    }

    return g;
}

export function calcCabinetStats({ width, height, thickness, verticalDividers, horizontalDividers}: CabinetModel) {

    const innerW = width - 2 * thickness;
    const innerH = height - 2 * thickness;

    return {
        innerH, innerW,
        cellW: (innerW - (verticalDividers * thickness)) / (verticalDividers + 1),
        cellH: (innerH - (horizontalDividers * thickness)) / (horizontalDividers + 1),
    }
}

export function buildCabinetParts(model: CabinetModel) {
    const { width, height, depth, backSide, boxType, verticalDividers, horizontalDividers, dividersType } = model;
    const { innerW, innerH, cellW, cellH } = calcCabinetStats(model);

    const parts = [
        { name: "Vertical Sides", width: depth, height: boxType == "TypeA" ? innerW : width, number: 2 },
        { name: "Horizontal Sides", width: depth, height: boxType == "TypeB" ? innerH : height, number: 2 },
    ];

    if (backSide == "TypeA") {
        parts.push({ name: "Back", width: width, height: height, number: 1 });
    } else if (backSide == "TypeB") {
        parts.push({ name: "Back", width: innerW, height: innerH, number: 1 });
    }

    if (dividersType == "TypeA") {
        parts.push({ name: "Vertical Dividers", width: depth, height: innerH, number: verticalDividers });
        parts.push({ name: "Horizontal Dividers", width: depth, height: cellW, number: (verticalDividers + 1) * horizontalDividers });
    } else if (dividersType == "TypeB") {
        parts.push({ name: "Horizontal Dividers", width: depth, height: innerW, number: horizontalDividers });
        parts.push({ name: "Vertical Dividers", width: depth, height: cellH, number: (horizontalDividers + 1) * verticalDividers });
    }

    return parts.filter(x => x.number > 0);
}