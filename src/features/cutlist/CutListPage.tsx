import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";
import Cabinet3D from "../../components/Cabinet3D";

type HoverInfo = { name: string; size: string } | null;

const PRESETS = {
    base: { width: 600, height: 720, depth: 560, shelves: 1 },
    wall: { width: 600, height: 720, depth: 350, shelves: 2 },
    tall: { width: 600, height: 2100, depth: 560, shelves: 4 },
};

export default function CutListPage() {
    const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
    const [preset, setPreset] = useState<keyof typeof PRESETS>("base");

    const [input, setInput] = useState({
        ...PRESETS.base,
        thickness: 18,
        back: true,
        doors: true,
        doorGap: 2,
    });

    function applyPreset(p: keyof typeof PRESETS) {
        setPreset(p);
        setInput({ ...input, ...PRESETS[p] });
    }

    const safe = {
        width: Math.max(1, input.width),
        height: Math.max(1, input.height),
        depth: Math.max(1, input.depth),
        thickness: Math.max(1, input.thickness),
    };

    const cutList = generateCutList({
        ...safe,
        doors: input.doors ? 2 : 0,
        doorGap: input.doorGap,
        back: input.back,
    });

    return (
        <div>
            <h1>Cabinet-Maker Toolkit</h1>

            <section style={{ display: "flex", gap: 24 }}>
                <Cabinet3D
                    width={safe.width}
                    height={safe.height}
                    depth={safe.depth}
                    shelves={input.shelves}
                    showBack={input.back}
                    doors={input.doors}
                    doorGap={input.doorGap}
                    onHover={setHoverInfo}
                />

                <div style={{ width: 260, border: "1px solid #ccc", padding: 16 }}>
                    <h3>Panel Info</h3>
                    {hoverInfo ? (
                        <>
                            <strong>{hoverInfo.name}</strong>
                            <div>{hoverInfo.size}</div>
                        </>
                    ) : (
                        <em>Hover a panel</em>
                    )}
                </div>
            </section>

            <section style={{ marginTop: 24 }}>
                <label>Cabinet type</label>
                <select value={preset} onChange={e => applyPreset(e.target.value as any)}>
                    <option value="base">Base cabinet</option>
                    <option value="wall">Wall cabinet</option>
                    <option value="tall">Tall cabinet</option>
                </select>

                <label>
                    <input type="checkbox" checked={input.doors}
                           onChange={e => setInput({ ...input, doors: e.target.checked })} />
                    Doors
                </label>

                <label>Door gap (mm)</label>
                <input type="number" value={input.doorGap}
                       onChange={e => setInput({ ...input, doorGap: +e.target.value || 2 })} />
            </section>

            <section>
                <h2>Cut List</h2>
                <ul>
                    {cutList.map(i => (
                        <li key={i.name}>{i.name}: {i.size} × {i.qty}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
