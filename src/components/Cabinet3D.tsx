import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type HoverInfo = {
    name: string;
    size: string;
} | null;

type Props = {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
    onHover: (info: HoverInfo) => void;
};

export default function Cabinet3D({
                                      width,
                                      height,
                                      depth,
                                      shelves,
                                      showBack,
                                      onHover,
                                  }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        /* ========== SCENE ========= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(45, 5 / 3, 0.1, 50);
        camera.position.set(2.4, 1.8, 2.4);
        camera.lookAt(0, 0.8, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1));
        const sun = new THREE.DirectionalLight(0xffffff, 0.9);
        sun.position.set(6, 8, 6);
        scene.add(sun);

        /* ========== MATERIALS ========= */
        const normalMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
        const highlightMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });

        /* ========== SCALE ========= */
        const w = width / 1000;
        const h = height / 1000;
        const d = depth / 1000;
        const t = 0.018;

        const panels: THREE.Mesh[] = [];

        const addPanel = (
            name: string,
            geo: THREE.BoxGeometry,
            x: number,
            y: n
