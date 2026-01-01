import React from "react";
import { CabinetEditor } from "./pages/cabinet/CabinetEditor";
import { CutListEditor } from "./pages/cutlist/cutlist";
import './styles/index.scss';
import {
	HashRouter as Router,
	Routes,
	Route,
	NavLink
} from "react-router";

function linkClassName({ isActive }: { isActive: boolean }) {
	return isActive ? '--active' : '';
}

export function App() {
	return (
		<div className="app">
			<Router>
				<nav className="ww-nabbar">
					<NavLink className={linkClassName} to="">Home</NavLink>
					<NavLink className={linkClassName} to="cabinet">Cabinet</NavLink >
					<NavLink className={linkClassName} to="cutlist">Cutlist</NavLink>
				</nav>
				<main>
					<Routes>
						<Route path="/" />
						<Route path="/cabinet" element={<CabinetEditor />} />
						<Route path="/cutlist" element={<CutListEditor />} />
					</Routes>
				</main>
			</Router>
		</div>
	);
}