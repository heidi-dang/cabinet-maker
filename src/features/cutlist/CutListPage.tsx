import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";

export default function CutListPage() {
    const [input, setInput] = useState({
        width: 600,
        height: 720,
        depth: 560,
        thickness: 18,
    });

    const safeInput = {
        width: Math.max(1, input.width),
        height: Math.max(1, input.height),
        depth: Math.max(1, input.depth),
        thickness: Math.max(1, input.thickness),
    };

    const cutList = generateCutList(safeInput);

    return (
        <div>
            <section>
                <h1>Cabinet-Maker Toolkit</h1>

                <p>
                    Use this app to quickly generate cut lists and estimate materials
                    for cabinetry and joinery work.
                </p>

                <ol>
                    <li>Enter cabinet dimensions below</li>
                    <li>Results update instantly</li>
                    <li>Use the sidebar for more tools</li>
                </ol>
            </section>

            <section>
                <h2>Cut List Generator</h2>

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

                    <label>Material Thickness (mm)</label>
                    <input
                        type="number"
                        value={input.thickness}
                        onChange={(e) =>
                            setInput({ ...input, thickness: Number(e.target.value) || 1 })
                        }
                    />
                </div>

                <h3>Cut List</h3>
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
