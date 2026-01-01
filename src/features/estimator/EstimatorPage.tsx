import React, { useState } from "react";

export default function EstimatorPage() {
    const [sheetWidth, setSheetWidth] = useState(2400);
    const [sheetHeight, setSheetHeight] = useState(1200);
    const [totalArea, setTotalArea] = useState(5); // m² default

    const sheetArea = (sheetWidth * sheetHeight) / 1_000_000;
    const sheetsRequired = Math.ceil(totalArea / sheetArea);
    const wastePercent =
        sheetArea > 0
            ? Math.max(0, ((sheetsRequired * sheetArea - totalArea) / (sheetsRequired * sheetArea)) * 100)
            : 0;

    return (
        <div>
            <h2>Material Estimator</h2>

            <p>
                Estimate how many sheets you need based on total panel area.
            </p>

            <div className="form">
                <label>Sheet Width (mm)</label>
                <input
                    type="number"
                    value={sheetWidth}
                    min={1}
                    onChange={(e) => setSheetWidth(Number(e.target.value) || 1)}
                />

                <label>Sheet Height (mm)</label>
                <input
                    type="number"
                    value={sheetHeight}
                    min={1}
                    onChange={(e) => setSheetHeight(Number(e.target.value) || 1)}
                />

                <label>Total Panel Area (m²)</label>
                <input
                    type="number"
                    value={totalArea}
                    min={0}
                    step={0.1}
                    onChange={(e) => setTotalArea(Number(e.target.value) || 0)}
                />
            </div>

            <h3>Result</h3>
            <ul>
                <li>Sheet size: {sheetWidth} × {sheetHeight} mm</li>
                <li>Sheet area: {sheetArea.toFixed(2)} m²</li>
                <li>Sheets required: {sheetsRequired}</li>
                <li>Estimated waste: {wastePercent.toFixed(1)}%</li>
            </ul>
        </div>
    );
}
