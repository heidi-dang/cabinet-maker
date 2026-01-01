import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";
import Cabinet3D from "../../components/Cabinet3D";
import "../../styles/cabinet.css";

type HoverInfo = { name: string; size: string } | null;

export default function CutListPage() {
    const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

    const [input, setInput] = useState({
        width: 600,
        height: 720,
        depth: 560,
        thickness: 18,
        shelves: 1,
        back: true,
        doors: 2,
        doorGap: 2,
    });

    const safe = {
        width: Math.max(1, input.width),
        height: Math.max(1, input.height),
        depth: Math.max(1, input.depth),
        thickness: Math.max(1, input.thickness),
    };

    const cutList = generateCutList({
        ...safe,
        back: input.back,
        doors: input.doors,
        doorGap: input.doorGap,
    });

    return (
        <div className="page">
            <h1>Cabinet Maker</h1>

            {/* 3D VIEW */}
            <section className="viewer-section">
                <div className="viewer">
                    <Cabinet3D
                        width={safe.width}
                        height={safe.height}
                        depth={safe.depth}
                        shelves={input.shelves}
                        showBack={input.back}
                        doors={input.doors > 0}
                        doorGap={input.doorGap}
                        onHover={setHoverInfo}
                    />
                </div>

                <div className="panel-info">
                    <h3>Panel info</h3>
                    {hoverInfo ? (
                        <>
                            <strong>{hoverInfo.name}</strong>
                            <div>{hoverInfo.size}</div>
                        </>
                    ) : (
                        <span style={{ color: "#666" }}>Tap or hover a panel</span>
                    )}
                </div>
            </section>

            {/* INPUTS */}
            <section className="inputs">
                <label>Width (mm)
                    <input type="number" value={input.width}
                           onChange={e => setInput({ ...input, width: +e.target.value || 1 })} />
                </label>

                <label>Height (mm)
                    <input type="number" value={input.height}
                           onChange={e => setInput({ ...input, height: +e.target.value || 1 })} />
                </label>

                <label>Depth (mm)
                    <input type="number" value={input.depth}
                           onChange={e => setInput({ ...input, depth: +e.target.value || 1 })} />
                </label>

                <label>Panel thickness (mm)
                    <input type="number" value={input.thickness}
                           onChange={e => setInput({ ...input, thickness: +e.target.value || 18 })} />
                </label>

                <label>Shelves
                    <input type="number" min={0} value={input.shelves}
                           onChange={e => setInput({ ...input, shelves: +e.target.value || 0 })} />
                </label>

                <label>
                    <input type="checkbox" checked={input.back}
                           onChange={e => setInput({ ...input, back: e.target.checked })} />
                    Back panel
                </label>

                <label>Number of doors
                    <input type="number" min={0} max={6} value={input.doors}
                           onChange={e => setInput({ ...input, doors: +e.target.value || 0 })} />
                </label>

                <label>Door gap (mm)
                    <input type="number" min={1} value={input.doorGap}
                           onChange={e => setInput({ ...input, doorGap: +e.target.value || 2 })} />
                </label>
            </section>

            {/* CUT LIST */}
            <section className="cutlist">
                <h2>Cut list</h2>
                <ul>
                    {cutList.map(i => (
                        <li key={i.name}>
                            {i.name}: {i.size} × {i.qty}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
