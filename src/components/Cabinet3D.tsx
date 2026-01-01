import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
};

export default function Cabinet3D({
                                      width,
                                      height,
                                      depth,
                                      shelves,
                                      showBack,
                                  }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        const camera = new THREE.PerspectiveCamera(45, 5 / 3, 0.1, 50);
        camera.position.set(2, 1.5, 2);
        camera.lookAt(0, 0.7, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(3, 4, 5);
        scene.add(light);

        const w = width / 1000;
        const h = height / 1000;
        const d = depth / 1000;
        const t = 0.018;

        const material = new THREE.MeshStandardMaterial({ color: 0x9b6a3d });

        const addBox = (x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
            const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
            m.position.set(x, y, z);
            scene.add(m);
        };

        // Panels
        addBox(-w / 2, h / 2, 0, t, h, d);
        addBox( w / 2, h / 2, 0, t, h, d);
        addBox(0, h, 0, w, t, d);
        addBox(0, 0, 0, w, t, d);

        if (showBack) {
            addBox(0, h / 2, -d / 2, w, h, t);
        }

        // Shelves
        for (let i = 1; i <= shelves; i++) {
            addBox(0, (h / (shelves + 1)) * i, 0, w - t * 2, t, d - t);
        }

        let dragging = false;
        let lastX = 0;

        const down = (e: MouseEvent) => {
            dragging = true;
            lastX = e.clientX;
        };

        const up = () => (dragging = false);

        const move = (e: MouseEvent) => {
            if (!dragging) return;
            scene.rotation.y += (e.clientX - lastX) * 0.005;
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
    }, [width, height, depth, shelves, showBack]);

    return (
        <div
            ref={mountRef}
            style={{
                width: "500px",
                height: "300px",
                border: "1px solid #ccc",
                marginBottom: "24px",
            }}
        />
    );
}
