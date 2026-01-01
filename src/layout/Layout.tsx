import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AppRoutes from "../routes/AppRoutes";

export default function Layout() {
    return (
        <>
            <Header />
            <div className="layout">
                <Sidebar />
                <main>
                    <AppRoutes />
                </main>
            </div>
        </>
    );
}
