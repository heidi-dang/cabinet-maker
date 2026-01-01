import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
    width: number;
    height: number;
    depth: number;
}

export default function Cabinet3D({ width, height, depth }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f6f8);

        const camera = new THREE.PerspectiveCamera(
            45,
            mountRef.current.clientWidth / 300,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, 300);
        mountRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        // Cabinet box (scaled to meters)
        const geometry = new THREE.BoxGeometry(
            width / 1000,
            height / 1000,
            depth / 1000
        );

        const material = new THREE.MeshStandardMaterial({
            color: 0x8b5a2b,
        });

        const cabinet = new THREE.Mesh(geometry, material);
        scene.add(cabinet);

        camera.position.set(1.5, 1.2, 1.5);
        camera.lookAt(0, 0, 0);

        let isDragging = false;
        let lastX = 0;

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            lastX = e.clientX;
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const delta = e.clientX - lastX;
            cabinet.rotation.y += delta * 0.005;
            lastX = e.clientX;
        };

        renderer.domElement.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.domElement.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [width, height, depth]);

    return (
        <div
            ref={mountRef}
            style={{
                width: "100%",
                maxWidth: "500px",
                height: "300px",
                marginBottom: "24px",
                border: "1px solid #ddd",
                background: "#f5f6f8",
            }}
        />
    );
}
