import React from "react";
import { Routes, Route } from "react-router";
import CutListPage from "../features/cutlist/CutListPage";
import EstimatorPage from "../features/estimator/EstimatorPage";
import ReferencePage from "../features/reference/ReferencePage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<CutListPage />} />
            <Route path="/estimator" element={<EstimatorPage />} />
            <Route path="/reference" element={<ReferencePage />} />
        </Routes>
    );
}
