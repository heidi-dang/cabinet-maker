import React from "react";
import { BrowserRouter } from "react-router";
import Layout from "./layout/Layout";

export default function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}
