import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
    exploded: boolean;
};

export default function Cabinet3D(props: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f6f8);

        const camera = new THREE.PerspectiveCamera(45, 5 / 3, 0.1, 100);
        camera.position.set(2, 2, 2);
        camera.lookAt(0, 0.6, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const light = new THREE.DirectionalLight(0xffffff, 0.6);
        light.position.set(5, 5, 5);
        scene.add(light);

        const w = props.width / 1000;
        const h = props.height / 1000;
        const d = props.depth / 1000;
        const t = 0.018;
        const e = props.exploded ? 0.15 : 0;

        const mat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });

        const add = (geo: THREE.BoxGeometry, x: number, y: number, z: number) => {
            const m = new THREE.Mesh(geo, mat);
            m.position.set(x, y, z);
            scene.add(m);
        };

        add(new THREE.BoxGeometry(t, h, d), -w / 2 - e, h / 2, 0);
        add(new THREE.BoxGeometry(t, h, d), w / 2 + e, h / 2, 0);
        add(new THREE.BoxGeometry(w, t, d), 0, h + e, 0);
        add(new THREE.BoxGeometry(w, t, d), 0, -e, 0);

        if (props.showBack) {
            add(new THREE.BoxGeometry(w, h, t), 0, h / 2, -d / 2 - e);
        }

        for (let i = 1; i <= props.shelves; i++) {
            add(
                new THREE.BoxGeometry(w - t * 2, t, d - t),
                0,
                (h / (props.shelves + 1)) * i,
                0
            );
        }

        let dragging = false;
        let lastX = 0;

        const down = (ev: MouseEvent) => {
            dragging = true;
            lastX = ev.clientX;
        };

        const up = () => {
            dragging = false;
        };

        const move = (ev: MouseEvent) => {
            if (!dragging) return;
            scene.rotation.y += (ev.clientX - lastX) * 0.005;
            lastX = ev.clientX;
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
            renderer.domElement.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mousemove", move);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [props]);

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
