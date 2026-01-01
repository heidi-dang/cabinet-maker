import React from "react";
import { Link } from "react-router";

export default function Sidebar() {
    return (
        <aside>
            <nav>
                <Link to="/">Cut List</Link>
                <Link to="/estimator">Material Estimator</Link>
                <Link to="/reference">Fixing Reference</Link>
            </nav>
        </aside>
    );
}
