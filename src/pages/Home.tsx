import React from "react";

export default function Home() {
    return (
        <div style={{ padding: "24px" }}>
            <h1>Cabinet Maker App</h1>

            <p>
                Welcome to the Cabinet Maker web application.
            </p>

            <h2>How to use</h2>

            <ol>
                <li>Go to <strong>Cabinet</strong> to design cabinets</li>
                <li>Go to <strong>Cutlist</strong> to generate cutting lists</li>
                <li>Review measurements carefully before production</li>
            </ol>

            <p>
                This app is designed for workshop and site use.
            </p>
        </div>
    );
}
