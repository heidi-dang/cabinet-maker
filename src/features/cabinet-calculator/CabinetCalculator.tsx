import React, { useState } from "react";
import { calculateCabinet } from "./calculateCabinet";
import { Panel } from "./types";

export default function CabinetCalculator() {
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(720);
    const [depth, setDepth] = useState(560);
    const [thickness, setThickness] = useState(18);

    const panels: Panel[] = calculateCabinet({
        width,
        height,
        depth,
        thickness,
    });

    return (
        <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
            <h2>Cabinet Calculator</h2>

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
                {panels.map(panel => (
                    <tr key={panel.name}>
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
