import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
    showDimensions: boolean;
};

export default function Cabinet3D({
                                      width,
                                      height,
                                      depth,
                                      shelves,
                                      showBack,
                                      showDimensions,
                                  }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(45, 5 / 3, 0.1, 50);
        camera.position.set(2, 1.6, 2);
        camera.lookAt(0, 0.7, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1));
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(4, 6, 4);
        scene.add(light);

        const panelMat = new THREE.MeshStandardMaterial({
            color: 0xe5e7eb,   // light grey (easy to see)
        });

        const edgeMat = new THREE.LineBasicMaterial({
            color: 0x000000,   // black outlines
        });

        const w = width / 1000;
        const h = height / 1000;
        const d = depth / 1000;
        const t = 0.018;

        const group = new THREE.Group();
        scene.add(group);

        const addPanel = (geo: THREE.BoxGeometry, x: number, y: number, z: number) => {
            const mesh = new THREE.Mesh(geo, panelMat);
            mesh.position.set(x, y, z);
            group.add(mesh);

            const edges = new THREE.EdgesGeometry(geo);
            const line = new THREE.LineSegments(edges, edgeMat);
            line.position.copy(mesh.position);
            group.add(line);
        };

        addPanel(new THREE.BoxGeometry(t, h, d), -w / 2, h / 2, 0);
        addPanel(new THREE.BoxGeometry(t, h, d),  w / 2, h / 2, 0);
        addPanel(new THREE.BoxGeometry(w, t, d),  0, h, 0);
        addPanel(new THREE.BoxGeometry(w, t, d),  0, 0, 0);

        if (showBack) {
            addPanel(new THREE.BoxGeometry(w, h, t), 0, h / 2, -d / 2);
        }

        for (let i = 1; i <= shelves; i++) {
            addPanel(
                new THREE.BoxGeometry(w - t * 2, t, d - t),
                0,
                (h / (shelves + 1)) * i,
                0
            );
        }

        // Dimension labels (global toggle)
        if (showDimensions) {
            const label = makeLabel(`${width} × ${height} × ${depth} mm`);
            label.position.set(0, -0.25, d / 2 + 0.4);
            scene.add(label);
        }

        let drag = false;
        let lastX = 0;

        const down = (e: MouseEvent) => {
            drag = true;
            lastX = e.clientX;
        };
        const up = () => (drag = false);
        const move = (e: MouseEvent) => {
            if (!drag) return;
            group.rotation.y += (e.clientX - lastX) * 0.005;
            lastX = e.clientX;
        };

        renderer.domElement.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);
        window.addEventListener("mousemove", move);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mousemove", move);
        };
    }, [width, height, depth, shelves, showBack, showDimensions]);

    return (
        <div
            ref={mountRef}
            style={{
                width: "500px",
                height: "300px",
                border: "1px solid #999",
                background: "#fff",
            }}
        />
    );
}

function makeLabel(text: string) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, c.width / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    sprite.scale.set(0.8, 0.2, 1);
    return sprite;
}
