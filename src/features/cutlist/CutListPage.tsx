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

            <h3>Cut List</h3>
            <ul>
                {cutList.map((item) => (
                    <li key={item.name}>
                        {item.name}: {item.size} (x{item.qty})
                    </li>
                ))}
            </ul>
        </div>
    );
}
