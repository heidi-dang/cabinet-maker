import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";
import Cabinet3D from "../../components/Cabinet3D";

export default function CutListPage() {
    const [type, setType] = useState<"base" | "wall">("base");
    const [exploded, setExploded] = useState(false);

    const presets = {
        base: { width: 600, height: 720, depth: 560, shelves: 1 },
        wall: { width: 600, height: 720, depth: 350, shelves: 2 },
    };

    const [input, setInput] = useState({
        width: presets.base.width,
        height: presets.base.height,
        depth: presets.base.depth,
        thickness: 18,
        shelves: presets.base.shelves,
        back: true,
    });

    const safe = {
        width: Math.max(1, input.width),
        height: Math.max(1, input.height),
        depth: Math.max(1, input.depth),
        thickness: Math.max(1, input.thickness),
    };

    const cutList = generateCutList(safe);

    const applyPreset = (t: "base" | "wall") => {
        setType(t);
        setInput({
            ...input,
            ...presets[t],
        });
    };

    return (
        <div>
            <h1>Cabinet-Maker Toolkit</h1>

            <section>
                <h2>Cabinet Type</h2>
                <button onClick={() => applyPreset("base")}>Base Cabinet</button>
                <button onClick={() => applyPreset("wall")}>Wall Cabinet</button>
                <button onClick={() => setExploded(!exploded)}>
                    {exploded ? "Normal View" : "Exploded View"}
                </button>
            </section>

            <section>
                <h2>3D Preview</h2>
                <Cabinet3D
                    width={safe.width}
                    height={safe.height}
                    depth={safe.depth}
                    shelves={input.shelves}
                    showBack={input.back}
                    exploded={exploded}
                />
            </section>

            <section>
                <h2>Dimensions</h2>

                <div className="form">
                    <label>Width (mm)</label>
                    <input
                        type="number"
                        value={input.width}
                        onChange={(e) =>
                            setInput({ ...input, width: Number(e.target.value) || 1 })
                        }
                    />

                    <label>Height (mm)</label>
                    <input
                        type="number"
                        value={input.height}
                        onChange={(e) =>
                            setInput({ ...input, height: Number(e.target.value) || 1 })
                        }
                    />

                    <label>Depth (mm)</label>
                    <input
                        type="number"
                        value={input.depth}
                        onChange={(e) =>
                            setInput({ ...input, depth: Number(e.target.value) || 1 })
                        }
                    />

                    <label>Shelves</label>
                    <input
                        type="number"
                        min={0}
                        value={input.shelves}
                        onChange={(e) =>
                            setInput({ ...input, shelves: Number(e.target.value) || 0 })
                        }
                    />

                    <label>
                        <input
                            type="checkbox"
                            checked={input.back}
                            onChange={(e) =>
                                setInput({ ...input, back: e.target.checked })
                            }
                        />
                        Back Panel
                    </label>
                </div>
            </section>

            <section>
                <h2>Cut List</h2>
                <ul>
                    {cutList.map((item) => (
                        <li key={item.name}>
                            {item.name}: {item.size} (×{item.qty})
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
