import React, { useState } from "react";
import { generateCutList } from "./cutListLogic";

export default function CutListPage() {
    const [input, setInput] = useState({
        width: 600,
        height: 720,
        depth: 560,
        thickness: 18,
    });

    const cutList = generateCutList(input);

    return (
        <div>
            {/* INTRODUCTION */}
            <section style={{ marginBottom: "32px" }}>
                <h1>Cabinet-Maker Toolkit</h1>

                <p>
                    This app is a practical toolkit designed for cabinet makers, joiners,
                    and installers. It helps you quickly calculate cut sizes, estimate
                    materials, and avoid common mistakes on site.
                </p>

                <h3>How to use this app</h3>
                <ol>
                    <li>
                        Start on the <strong>Cut List</strong> page (this page).
                    </li>
                    <li>
                        Enter your cabinet dimensions in millimetres.
                    </li>
                    <li>
                        The cut list will update automatically.
                    </li>
                    <li>
                        Use the sidebar to access the Material Estimator and Fixing
                        Reference.
                    </li>
                </ol>

                <p>
                    This tool is designed to be fast, simple, and reliable for daily site
                    work.
                </p>
            </section>

            <hr />

            {/* CUT LIST TOOL */}
            <section>
                <h2>Cut List Generator</h2>

                <div>
                    <label>Width (mm)</label>
                    <input
                        type="number"
                        value={input.width}
                        onChange={(e) =>
                            setInput({ ...input, width: Number(e.target.value) })
                        }
                    />
                </div>

                <div>
                    <label>Height (mm)</label>
                    <input
                        type="number"
                        value={input.height}
                        onChange={(e) =>
                            setInput({ ...input, height: Number(e.target.value) })
                        }
                    />
                </div>

                <div>
                    <label>Depth (mm)</label>
                    <input
                        type="number"
                        value={input.depth}
                        onChange={(e) =>
                            setInput({ ...input, depth: Number(e.target.value) })
                        }
                    />
                </div>

                <div>
                    <label>Material Thickness (mm)</label>
                    <input
                        type="number"
                        value={input.thickness}
                        onChange={(e) =>
                            setInput({ ...input, thickness: Number(e.target.value) })
                        }
                    />
                </div>

                <h3>Cut List Result</h3>
                <ul>
                    {cutList.map((item) => (
                        <li key={item.name}>
                            {item.name}: {item.size} (x{item.qty})
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
