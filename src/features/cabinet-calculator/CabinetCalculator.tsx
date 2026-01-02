import React, { useState } from "react";
import { calculateCabinet } from "./calculateCabinet";
import { CabinetType, Panel } from "./types";

export default function CabinetCalculator() {
    const [type, setType] = useState<CabinetType>("BASE");
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(720);
    const [depth, setDepth] = useState(560);
    const [thickness, setThickness] = useState(18);

    const panels: Panel[] = calculateCabinet({
        type,
        width,
        height,
        depth,
        thickness,
    });

    const panels = calculateCabinet({
        type,
        width,
        height,
        depth,
        thickness,
        drawerConfig:
            type === "DRAWER"
                ? {
                    openingWidth: width,
                    openingHeight: height,
                    openingDepth: depth,
                    slideClearance: 25.4,
                }
                : undefined,
    });

    return (
        <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
            <h2>Cabinet Calculator</h2>

            <label>Cabinet Type</label>

            {type === "DRAWER" && (
                <>
                    <label>Cabinet Opening Width (mm)</label>
                    <input
                        type="number"
                        value={width}
                        onChange={e => setWidth(+e.target.value)}
                    />

                    <label>Cabinet Opening Height (mm)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={e => setHeight(+e.target.value)}
                    />

                    <label>Cabinet Opening Depth (mm)</label>
                    <input
                        type="number"
                        value={depth}
                        onChange={e => setDepth(+e.target.value)}
                    />
                </>
            )}

            <select value={type} onChange={e => setType(e.target.value as CabinetType)}>
                <option value="BASE">Base Cabinet</option>
                <option value="WALL">Wall Cabinet</option>
                <option value="DRAWER">Drawer</option>
            </select>

            <label>Width (mm)</label>
            <input type="number" value={width} onChange={e => setWidth(+e.target.value)} />

            <label>Height (mm)</label>
            <input type="number" value={height} onChange={e => setHeight(+e.target.value)} />

            <label>Depth (mm)</label>
            <input type="number" value={depth} onChange={e => setDepth(+e.target.value)} />

            <label>Board Thickness (mm)</label>
            <input type="number" value={thickness} onChange={e => setThickness(+e.target.value)} />

            <h3>Cut List</h3>

            <table width="100%" cellPadding={6}>
                <thead>
                <tr>
                    <th align="left">Panel</th>
                    <th>W</th>
                    <th>H</th>
                    <th>Qty</th>
                </tr>
                </thead>
                <tbody>
                {panels.map((panel, index) => (
                    <tr key={index}>
                        <td>{panel.name}</td>
                        <td>{panel.width}</td>
                        <td>{panel.height}</td>
                        <td>{panel.quantity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
