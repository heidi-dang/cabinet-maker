import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <nav
                style={{
                    background: "#1f4fd8",
                    padding: "12px 20px",
                    color: "#fff",
                }}
            >
                <Link to="/" style={{ color: "#fff", marginRight: 20 }}>
                    Home
                </Link>
                <Link to="/cabinet" style={{ color: "#fff", marginRight: 20 }}>
                    Cabinet
                </Link>
                <Link to="/cutlist" style={{ color: "#fff" }}>
                    Cutlist
                </Link>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
