import React from "react";

export default function Home() {
    return (
        <section>
            <h1>Cabinet Maker</h1>

            <p>
                Precision joinery and modern craftsmanship,
                built with clarity, care, and purpose.
            </p>

            <button
                style={{
                    marginTop: "var(--space-lg)",
                    padding: "12px 20px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--color-accent)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 500,
                }}
            >
                Get Started
            </button>
        </section>
    );
}
