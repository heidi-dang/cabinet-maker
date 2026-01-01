import { useMemo } from "react";
import React from "react";
import { Viewport3D } from "../../common/3d/viewport3d";
import { buildCabinetParts, CabinetModel, calcCabinetStats, createCabinetModel } from "./logic";
import { Button, Form, InputLayout, useInputChange } from "../../common";
import { useNavigate } from "react-router";
import { lineColor, sideColor } from "../../config";
import { useLocalStorage } from "../../common/useLocalStorage";

export function CabinetEditor(props: any) {

	const navigate = useNavigate();
	const [state, setState, reset] = useLocalStorage("cabinet", () => ({
		width: 400,
		height: 720,
		depth: 550,
		thickness: 18,
		boxType: "TypeA",
		backSide: "",
		verticalDividers: 0,
		horizontalDividers: 0,
		dividersType: "TypeB"
	} as CabinetModel));

	const onInputChange = useInputChange(setState);
	const model = useMemo(() => createCabinetModel(state, sideColor, lineColor), [state]);
	const stats = useMemo(() => calcCabinetStats(state), [state]);

	const handleBuildClick = () => navigate("/cutlist", { state: { parts: buildCabinetParts(state) } });

	return (<div className="hstack gap-1">
		<Form className="flex-grow">
			<InputLayout label="Width">
				<input name="width" type="number" value={state.width} onChange={onInputChange} />
			</InputLayout>
			<InputLayout label="Height">
				<input name="height" type="number" value={state.height} onChange={onInputChange} />
			</InputLayout>
			<InputLayout label="Depth">
				<input name="depth" type="number" value={state.depth} onChange={onInputChange} />
			</InputLayout>
			<InputLayout label="Thickness">
				<input name="thickness" type="number" value={state.thickness} onChange={onInputChange} />
			</InputLayout>

			<InputLayout label="Back Side">
				<label><input name="backSide" type="radio" value="" onChange={onInputChange} defaultChecked /> None</label>
				<label><input name="backSide" type="radio" value="TypeA" onChange={onInputChange} /> Type A</label>
				<label><input name="backSide" type="radio" value="TypeB" onChange={onInputChange} /> Type B</label>
			</InputLayout>
			<InputLayout label="Box Type">
				<label><input name="boxType" type="radio" value="TypeA" onChange={onInputChange} defaultChecked /> Type A</label>
				<label><input name="boxType" type="radio" value="TypeB" onChange={onInputChange} /> Type B</label>
			</InputLayout>
			<InputLayout label="Vertical Dividers">
				<input name="verticalDividers" type="number" value={state.verticalDividers} onChange={onInputChange} />
			</InputLayout>
			<InputLayout label="Horizontal Dividers">
				<input name="horizontalDividers" type="number" value={state.horizontalDividers} onChange={onInputChange} />
			</InputLayout>
			<InputLayout label="Dividers Type">
				<label><input name="dividersType" type="radio" value="TypeA" onChange={onInputChange} defaultChecked /> Type A</label>
				<label><input name="dividersType" type="radio" value="TypeB" onChange={onInputChange} /> Type B</label>
			</InputLayout>

			<div>Inner Width: {stats.innerW}</div>
			<div>Inner Height: {stats.innerH}</div>
			<div>Cell Width: {stats.cellW}</div>
			<div>Cell Height: {stats.cellH}</div>

			<div className="hstack gap-1">
				<Button onClick={handleBuildClick}>Build Cutlist</Button>
				<Button onClick={() => reset()}>Reset</Button>
			</div>
		</Form>
		<Viewport3D className="flex-grow" width={600} height={600} model={model} />
	</div>);
}