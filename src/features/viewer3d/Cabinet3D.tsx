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

export function Cabinet3D({
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
        const renderer = new THREE.WebGLRenderer({antialias: true});
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
        const carcassMat = new THREE.MeshStandardMaterial({color: "#d7c4a3"});
        const drawerMat = new THREE.MeshStandardMaterial({color: "#b89b72"});

        // Animation drawer
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

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

        const drawers: {
            mesh: THREE.Object3D;
            isOpen: boolean;
        }[] = [];

        for (let i = 0; i < drawerCount; i++) {
            // Create a group so we can add finger pull detail
            const drawerGroup = new THREE.Group();

            // Drawer box body
            const drawerBox = new THREE.Mesh(
                new THREE.BoxGeometry(width - 20, drawerHeight - 10, depth - 20),
                drawerMat
            );
            drawerGroup.add(drawerBox);

            // Finger pull recess (visual groove)
            const fingerPull = new THREE.Mesh(
                new THREE.BoxGeometry(width / 3, 15, 10),
                new THREE.MeshStandardMaterial({color: "#8b6f47"})
            );

            // Position finger pull at top front edge
            fingerPull.position.y = (drawerHeight - 10) / 2 - 7;
            fingerPull.position.z = (depth - 20) / 2 + 5;

            drawerGroup.add(fingerPull);

            // Position drawer group in cabinet
            drawerGroup.position.y =
                drawerHeight / 2 +
                i * (drawerHeight + drawerGap);

            drawerGroup.position.z = 5;

            drawerGroup.userData.index = i;

            drawers.push({mesh: drawerGroup, isOpen: false});
            scene.add(drawerGroup);
        }


        // Animate
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        const animate = () => {
            requestAnimationFrame(animate);

            drawers.forEach(d => {
                const targetZ = d.isOpen ? depth * 0.6 : 5;
                d.mesh.position.z += (targetZ - d.mesh.position.z) * 0.1;
            });

            controls.update();
            renderer.render(scene, camera);
        };


        // Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [width, height, depth, drawerCount, drawerGap]);

    return <div ref={mountRef} style={{width: "100%", height: 300}}/>;
}

function onClick(event: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        drawers.map(d => d.mesh)
    );

    if (intersects.length > 0) {
        const hit = intersects[0].object;

        const drawer = drawers.find(d =>
            hit === d.mesh || d.mesh.children.includes(hit)
        );

        if (drawer) {
            drawer.isOpen = !drawer.isOpen;
        }
    }
}

renderer.domElement.addEventListener("click", onClick);
renderer.domElement.removeEventListener("click", onClick);
