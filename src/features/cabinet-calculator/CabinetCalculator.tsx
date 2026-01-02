import React, { useState } from "react";
import { calculateCabinet } from "./calculateCabinet";
import { CabinetType } from "./types";
import {Cabinet3D} from "../viewer3d/Cabinet3D";

export default function CabinetCalculator() {
    const [type, setType] = useState<CabinetType>("BASE");
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(720);
    const [depth, setDepth] = useState(560);
    const [thickness, setThickness] = useState(18);

    // Drawer-only
    const [drawerCount, setDrawerCount] = useState(3);
    const [drawerGap, setDrawerGap] = useState(2);

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
        drawerStack:
            type === "DRAWER"
                ? {
                    drawerCount,
                    verticalGap: drawerGap,
                }
                : undefined,
    });

    return (
        <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
            <h2>Cabinet Calculator</h2>

            <label>Cabinet Type</label>
            <select
                value={type}
                onChange={e => setType(e.target.value as CabinetType)}
            >
                <option value="BASE">Base Cabinet</option>
                <option value="WALL">Wall Cabinet</option>
                <option value="DRAWER">Drawer Stack</option>
            </select>

            <label>Cabinet Width (mm)</label>
            <input
                type="number"
                value={width}
                onChange={e => setWidth(+e.target.value)}
            />

            <label>Cabinet Height (mm)</label>
            <input
                type="number"
                value={height}
                onChange={e => setHeight(+e.target.value)}
            />

            <label>Cabinet Depth (mm)</label>
            <input
                type="number"
                value={depth}
                onChange={e => setDepth(+e.target.value)}
            />

            <label>Board Thickness (mm)</label>
            <input
                type="number"
                value={thickness}
                onChange={e => setThickness(+e.target.value)}
            />

            {type === "DRAWER" && (
                <>
                    <label>Number of Drawers</label>
                    <input
                        type="number"
                        min={1}
                        value={drawerCount}
                        onChange={e => setDrawerCount(+e.target.value)}
                    />

                    <label>Vertical Gap Between Fronts (mm)</label>
                    <input
                        type="number"
                        min={1}
                        value={drawerGap}
                        onChange={e => setDrawerGap(+e.target.value)}
                    />
                </>
            )}

            <h3>3D Preview</h3>

            <Cabinet3D
                width={width}
                height={height}
                depth={depth}
                drawerCount={type === "DRAWER" ? drawerCount : 0}
                drawerGap={drawerGap}
            />

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
