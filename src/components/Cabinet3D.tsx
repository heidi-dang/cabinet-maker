import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    width: number;
    height: number;
    depth: number;
    shelves: number;
    showBack: boolean;
    exploded: boolean;
    doorsOpen: boolean;
};

export default function Cabinet3D({
                                      width,
                                      height,
                                      depth,
                                      shelves,
                                      showBack,
                                      exploded,
                                      doorsOpen,
                                  }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // ---------- BASIC SETUP ----------
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf4f4f4);

        const camera = new THREE.PerspectiveCamera(45, 5 / 3, 0.1, 100);
        camera.position.set(2.5, 2, 2.5);
        camera.lookAt(0, 0.8, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 300);
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const sun = new THREE.DirectionalLight(0xffffff, 0.6);
