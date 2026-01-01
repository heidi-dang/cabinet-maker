import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";
import Cabinet3D from "../../components/Cabinet3D";

export default function CutListPage() {
    const [exploded, setExploded] = useState(false);
    const [doorsOpen, setDoorsOpen] = useState(false);
    const [showDimensions, setShowDimensions] = useState(true);

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

            <section>
                <button onClick={() => setExploded(!exploded)}>
                    {exploded ? "Normal View" : "Exploded View"}
                </button>
                <button onClick={() => setDoorsOpen(!doorsOpen)}>
                    {doorsOpen ? "Close Doors" : "Open Doors"}
                </button>
            </section>

            <section>
                <Cabinet3D
                    width={safe.width}
                    height={safe.height}
                    depth={safe.depth}
                    shelves={input.shelves}
                    showBack={input.back}
                    exploded={exploded}
                    doorsOpen={doorsOpen}
                />
            </section>

            <section className="form">
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
                    <input
                        type="checkbox"
                        checked={showDimensions}
                        onChange={(e) => setShowDimensions(e.target.checked)}
                    />
                    Show dimensions
                </label>

                <label>
                    <input type="checkbox" checked={input.back}
                           onChange={e => setInput({ ...input, back: e.target.checked })} />
                    Back Panel
                </label>
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
