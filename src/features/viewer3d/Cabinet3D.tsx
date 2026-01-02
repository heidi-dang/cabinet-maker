import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Cabinet3D() {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            60,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(2, 2, 4);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );

        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Simple cabinet box
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
        const cabinet = new THREE.Mesh(geometry, material);
        scene.add(cabinet);

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        // Render loop
        const animate = () => {
            cabinet.rotation.y += 0.005;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup (CRITICAL)
        return () => {
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ width: "100%", height: 300, marginTop: 24 }}
        />
    );
}
