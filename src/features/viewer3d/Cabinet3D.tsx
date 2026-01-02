import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {
    width: number;
    height: number;
    depth: number;
    drawerCount: number;
    drawerGap: number;
};

export default function Cabinet3D({
                                      width,
                                      height,
                                      depth,
                                      drawerCount,
                                      drawerGap,
                                  }: Props) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#f5f5f5");

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            mountRef.current.clientWidth / 300,
            1,
            5000
        );
        camera.position.set(800, 600, 800);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, 300);
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(500, 1000, 500);
        scene.add(dirLight);

        // Materials
        const carcassMat = new THREE.MeshStandardMaterial({ color: "#d7c4a3" });
        const drawerMat = new THREE.MeshStandardMaterial({ color: "#b89b72" });

        // Cabinet carcass
        const carcass = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            carcassMat
        );
        carcass.position.y = height / 2;
        scene.add(carcass);

        // Drawer stack
        const usableHeight = height - drawerGap * (drawerCount - 1);
        const drawerHeight = usableHeight / drawerCount;

        for (let i = 0; i < drawerCount; i++) {
            const drawer = new THREE.Mesh(
                new THREE.BoxGeometry(width - 20, drawerHeight - 10, depth - 20),
                drawerMat
            );

            drawer.position.y =
                drawerHeight / 2 +
                i * (drawerHeight + drawerGap);

            drawer.position.z = 5;
            scene.add(drawer);
        }

        // Animate
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [width, height, depth, drawerCount, drawerGap]);

    return <div ref={mountRef} style={{ width: "100%", height: 300 }} />;
}
