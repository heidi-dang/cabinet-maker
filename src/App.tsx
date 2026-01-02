import { ErrorBoundary } from "./app/ErrorBoundary";
import CabinetCalculator from "./features/cabinet-calculator/CabinetCalculator";

export default function App() {
    return (
        <ErrorBoundary>
            <CabinetCalculator />
        </ErrorBoundary>
    );
}
