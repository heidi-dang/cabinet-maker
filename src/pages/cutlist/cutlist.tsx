import React, { useState, useRef } from "react";
import { Part } from "./core";
import { Button, InputLayout,  useInputChange, useLocalStorage } from "../../common";
import { useLocation } from "react-router";
import { flipSizes, layoutParts } from "./layout";
import "./Cutlist.scss";

interface PartLine extends Part {
    name: string;
    number: number;
}

interface CutListState {
    parts: PartLine[];
    newPart: PartLine;
}

const initialPart = {
    name: "",
    width: 0,
    height: 0,
    number: 1  
}

export function CutListEditor() {
    const location = useLocation();
    const [sheetSize, setSheetSize, reset] = useLocalStorage("sheetSize", { width: 2750, height: 1830 });
    const onSheetSizeInputChange = useInputChange(setSheetSize);
    const [parts, setParts] = useState<PartLine[]>(location.state?.parts || []);
    const [newPart, setNewPart] = useState<PartLine>(initialPart);
    const onNewPartInputChange = useInputChange(setNewPart);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function addPart() {
        setParts([newPart, ...parts]);
        setNewPart(initialPart);
    }

    function removePart(part: Part) {
        setParts(parts.filter(p => p != part));
    }

    function flip() {
        setParts(flipSizes(parts));
    }

    function build() {
        const canvas = canvasRef.current;

        const { offsetWidth, offsetHeight } = canvas;
        canvas.width = offsetWidth;
        canvas.height = offsetHeight;

        const ctx = canvas.getContext("2d");
        const rects = layoutParts(parts, sheetSize.width, sheetSize.height);

        const scale = Math.min(canvas.width / sheetSize.width, canvas.height / sheetSize.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);

        ctx.strokeRect(0, 0, sheetSize.width, sheetSize.height);
        ctx.font = `${(12 / scale).toFixed(0)}px Arial`;

        for (const rect of rects) {
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            ctx.fillText(`W: ${rect.width}, H: ${rect.height}`, rect.x + 5, rect.y + 15 / scale);
        }

        ctx.resetTransform();
    }

    return (
        <div className="cutlist-editor">
            <form className="parts-form">
                <fieldset className="vstack gap-1">
                    <legend>Sheet Size</legend>
                    <InputLayout label="Width">
                        <input name="width" type="number" value={sheetSize.width}  onChange={onSheetSizeInputChange} />
                    </InputLayout>
                    <InputLayout label="Height">
                        <input name="height" type="number" value={sheetSize.height} onChange={onSheetSizeInputChange} />
                    </InputLayout>
                    <div>
                        <Button onClick={() => reset()}>Reset</Button>
                    </div>
                </fieldset>
                <table className="ww-parts-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Number</th>
                            <th>Width</th>
                            <th>Height</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input name="name" type="text" value={newPart.name} onChange={onNewPartInputChange} /></td>
                            <td><input name="number" type="number" value={newPart.number} onChange={onNewPartInputChange} /></td>
                            <td><input name="width" type="number" value={newPart.width} onChange={onNewPartInputChange} /></td>
                            <td><input name="height" type="number" value={newPart.height} onChange={onNewPartInputChange} /></td>
                            <td><Button className="w-100" onClick={() => addPart()}>Add</Button></td>
                        </tr>
                        {parts.map((p, i) => {
                            return (<tr key={i}>
                                <td>{p.name}</td>
                                <td>{p.number}</td>
                                <td>{p.width}</td>
                                <td>{p.height}</td>
                                <td><Button className="w-100" onClick={() => removePart(p)}>Remove</Button></td>
                            </tr>);
                        })}
                    </tbody>
                </table>
            </form> 
            <div className="canvas-container">
                <div className="hstack gap-1">
                    <Button onClick={() => build()}>Build</Button>
                    <Button onClick={() => flip()}>Flip</Button>
                </div>
                <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
            </div>
        </div>
    );
}