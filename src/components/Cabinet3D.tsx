import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type HoverInfo = { name: string; size: string } | null;

type Props = {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
    doors: boolean;
    doorGap: number; // mm
    onHover: (info: HoverInfo) => void;
};

export default function Cabinet3D(props: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(45, 5 / 3, 0.1, 50);
        camera.position.set(2.4, 1.8, 2.4);
        camera.lookAt(0, 0.8, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1));
        const light = new THREE.DirectionalLight(0xffffff, 0.9);
        light.position.set(6, 8, 6);
        scene.add(light);

        const carcassMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
        const doorMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db });
        const highlightMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });

        const w = props.width / 1000;
        const h = props.height / 1000;
        const d = props.depth / 1000;
        const t = 0.018;
        const gap = props.doorGap / 1000;

        const panels: THREE.Mesh[] = [];

        function addPanel(
            name: string,
            geo: THREE.BoxGeometry,
            x: number,
            y: number,
            z: number,
            size: string,
            mat = carcassMat
        ) {
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.userData = { name, size };
            scene.add(mesh);
            panels.push(mesh);

            const edges = new THREE.LineSegments(
                new THREE.EdgesGeometry(geo),
                new THREE.LineBasicMaterial({ color: 0x000000 })
            );
            edges.position.copy(mesh.position);
            scene.add(edges);
        }

        // === CARCASS ===
        addPanel("Left side", new THREE.BoxGeometry(t, h, d), -w / 2, h / 2, 0, `${props.height} × ${props.depth} mm`);
        addPanel("Right side", new THREE.BoxGeometry(t, h, d), w / 2, h / 2, 0, `${props.height} × ${props.depth} mm`);
        addPanel("Top", new THREE.BoxGeometry(w, t, d), 0, h, 0, `${props.width} × ${props.depth} mm`);
        addPanel("Bottom", new THREE.BoxGeometry(w, t, d), 0, 0, 0, `${props.width} × ${props.depth} mm`);

        if (props.showBack) {
            addPanel("Back", new THREE.BoxGeometry(w, h, t), 0, h / 2, -d / 2, `${props.width} × ${props.height} mm`);
        }

        // === SHELVES ===
        for (let i = 1; i <= props.shelves; i++) {
            addPanel(
                `Shelf ${i}`,
                new THREE.BoxGeometry(w - t * 2, t, d - t),
                0,
                (h / (props.shelves + 1)) * i,
                0,
                `${props.width} × ${props.depth} mm`
            );
        }

        // === DOORS ===
        if (props.doors) {
            const doorWidth = (w - gap) / 2;
            const doorDepth = t;
            const z = d / 2 + doorDepth / 2;

            addPanel(
                "Left door",
                new THREE.BoxGeometry(doorWidth, h, doorDepth),
                -doorWidth / 2 - gap / 2,
                h / 2,
                z,
                `${props.height} × ${props.width / 2} mm`,
                doorMat
            );

            addPanel(
                "Right door",
                new THREE.BoxGeometry(doorWidth, h, doorDepth),
                doorWidth / 2 + gap / 2,
                h / 2,
                z,
                `${props.height} × ${props.width / 2} mm`,
                doorMat
            );
        }

        // === HOVER ===
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let active: THREE.Mesh | null = null;

        function onMove(e: MouseEvent) {
            const r = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const hit = raycaster.intersectObjects(panels)[0];

            if (hit) {
                const m = hit.object as THREE.Mesh;
                if (active && active !== m) active.material = carcassMat;
                m.material = highlightMat;
                active = m;
                props.onHover({ name: m.userData.name, size: m.userData.size });
            } else {
                if (active) active.material = carcassMat;
                active = null;
                props.onHover(null);
            }
        }

        renderer.domElement.addEventListener("mousemove", onMove);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        return () => {
            renderer.domElement.removeEventListener("mousemove", onMove);
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [props]);

    return <div ref={mountRef} style={{ width: 500, height: 300, border: "1px solid #666" }} />;
}
