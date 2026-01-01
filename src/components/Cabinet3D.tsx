import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
    exploded: boolean;
}

export default function Cabinet3D({
                                      width,
                                      height,
                                      depth,
                                      shelves,
                                      showBack,
                                      exploded,
                                  }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f6f8);

        // Camera
        const camera = new THREE.PerspectiveCamera(45, 1.6, 0.1, 100);
        camera.position.set(1.8, 1.6, 1.8);
        camera.lookAt(0, 0.6, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const light = new THREE.DirectionalLight(0xffffff, 0.6);
        light.position.set(3, 5, 4);
        scene.add(light);

        const mat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });

        const w = width / 1000;
        const h = height / 1000;
        const d = depth / 1000;
        const t = 0.018;
        const explode = exploded ? 0.15 : 0;

        const parts: THREE.Mesh[] = [];

        // Side panels
        const left = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), mat);
        left.position.set(-w / 2 - explode, h / 2, 0);
        parts.push(left);

        const right = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), mat);
        right.position.set(w / 2 + explode, h / 2, 0);
        parts.push(right);

        // Top & bottom
        const top = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), mat);
        top.position.set(0, h + explode, 0);
        parts.push(top);

        const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), mat);
        bottom.position.set(0, -explode, 0);
        parts.push(bottom);

        // Back panel
        if (showBack) {
            const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), mat);
            back.position.set(0, h / 2, -d / 2 - explode);
            parts.push(back);
        }

        // Shelves
        for (let i = 1; i <= shelves; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(w - t * 2, t, d - t),
                mat
            );
            shelf.position.set(0, (h / (shelves + 1)) * i, 0);
            parts.push(shelf);
        }

        parts.forEach((p) => scene.add(p));

        // Rotation controls
        let dragging = false;
        let lastX = 0;

        const onMouseDown = (e: MouseEvent) => {
            dragging = true;
            lastX = e.clientX;
        };

        const onMouseUp = () => {
            dragging = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            scene.rotation.y += (e.clientX - lastX) * 0.005;
            lastX = e.clientX;
        };

        renderer.domElement.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp
