import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";
import Cabinet3D from "../../components/Cabinet3D";

type HoverInfo = {
    name: string;
    size: string;
} | null;

export default function CutListPage() {
    const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

    const [input, setInput] = useState({
        width: 600,
        height: 720,
        depth: 560,
        thickness: 18,
        shelves: 1,
        back: true,
    });

    const safe = {
        width: Math.max(1, input.width),
        height: Math.max(1, input.height),
        depth: Math.max(1, input.depth),
        thickness: Math.max(1, input.thickness),
    };

    const cutList = generateCutList(safe);

    return (
        <div>
            <h1>Cabinet-Maker Toolkit</h1>

            <section style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <Cabinet3D
                    width={safe.width}
                    height={safe.height}
                    depth={safe.depth}
                    shelves={input.shelves}
                    showBack={input.back}
                    onHover={setHoverInfo}
                />

                <div
                    style={{
                        width: "240px",
                        padding: "16px",
                        border: "1px solid #ccc",
                        background: "#f9fafb",
                    }}
                >
                    <h3>Panel Info</h3>

                    {hoverInfo ? (
                        <>
                            <p><strong>{hoverInfo.name}</strong></p>
                            <p>Size: {hoverInfo.size}</p>
                        </>
                    ) : (
                        <p style={{ color: "#666" }}>Hover a panel to see details</p>
                    )}
                </div>
            </section>

            <section className="form" style={{ marginTop: "24px" }}>
                <label>Width (mm)</label>
                <input type="number" value={input.width}
                       onChange={e => setInput({ ...input, width: +e.target.value || 1 })} />

                <label>Height (mm)</label>
                <input type="number" value={input.height}
                       onChange={e => setInput({ ...input, height: +e.target.value || 1 })} />

                <label>Depth (mm)</label>
                <input type="number" value={input.depth}
                       onChange={e => setInput({ ...input, depth: +e.target.value || 1 })} />

                <label>Shelves</label>
                <input type="number" min={0} value={input.shelves}
                       onChange={e => setInput({ ...input, shelves: +e.target.value || 0 })} />

                <label>
                    <input type="checkbox" checked={input.back}
                           onChange={e => setInput({ ...input, back: e.target.checked })} />
                    Back panel
                </label>
            </section>

            <section>
                <h2>Cut List</h2>
                <ul>
                    {cutList.map(item => (
                        <li key={item.name}>
                            {item.name}: {item.size} × {item.qty}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
