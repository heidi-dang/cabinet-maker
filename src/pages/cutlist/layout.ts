import { Part, Rect } from "./core";

export function layoutParts(parts: Part[], totalWidth: number, totalHeight: number): Rect[] {
    const positioned: Rect[] = [];
    let x = 0, y = 0, rowHeight = 0;

    for (const part of parts.sort(compareParts)) {
        for (let i = 0; i < part.number; i++) {
            if (x + part.width > totalWidth) {
                x = 0;
                y += rowHeight;
                rowHeight = 0;
            }
            if (y + part.height > totalHeight) {
                break;
            }
            positioned.push({ x, y, width: part.width, height: part.height });
            x += part.width;
            rowHeight = Math.max(rowHeight, part.height);
        }
    }
    return positioned;
}

export function flipSizes<T extends Part = Part>(parts: T[]): T[] {
    return parts.map(part => ({
        ...part,
        width: part.height,
        height: part.width,
        number: part.number
    }));
}

function compareParts(a: Part, b: Part): number {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;

    if (areaA !== areaB) return areaB - areaA;
    if (a.width !== b.width) return b.width - a.width; 
    return b.height - a.height;
}