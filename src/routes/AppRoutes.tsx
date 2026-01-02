import React from "react";
import { Routes, Route } from "react-router";
import CutListPage from "../features/cutlist/CutListPage";
import EstimatorPage from "../features/estimator/EstimatorPage";
import ReferencePage from "../features/reference/ReferencePage";
import CabinetCalculator from "../features/cabinet-calculator/CabinetCalculator";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<CabinetCalculator />} />
            <Route path="/" element={<CutListPage />} />
            <Route path="/estimator" element={<EstimatorPage />} />
            <Route path="/reference" element={<ReferencePage />} />
        </Routes>
    );
}
