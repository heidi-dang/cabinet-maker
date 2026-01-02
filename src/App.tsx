import React from "react";
import { HashRouter } from "react-router";
import Layout from "./layout/Layout";

export default function App() {
    return (
        <HashRouter>
            <Layout />
        </HashRouter>
    );
}