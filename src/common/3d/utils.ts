import { BoxGeometry, MeshBasicMaterial, EdgesGeometry, LineSegments, Group, Mesh, Object3D, LineBasicMaterial } from "three";

export function createBox(width: number, height: number, depth: number, fillColor: number, lineColor: number): Object3D {
	var geometry = new BoxGeometry(width, height, depth);
	var material = new MeshBasicMaterial({ color: fillColor });

	var edges = new EdgesGeometry(geometry);
	var line = new LineSegments(edges, new LineBasicMaterial({ color: lineColor }));

	var g = new Group();

	g.add(new Mesh(geometry, material), line)

	return g;
}
