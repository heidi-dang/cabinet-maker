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

        // ---------- SCENE ----------
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

        // ---------- MATERIALS ----------
        const panelMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
        const highlightMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd });

        // ---------- SCALE ----------
        const w = width / 1000;
        const h = height / 1000;
        const d = depth / 1000;
        const t = 0.018;

        const panels: THREE.Mesh[] = [];

        const addPanel = (
            name: string,
            geo: THREE.BoxGeometry,
            x: number,
            y: number,
            z: number,
            sizeLabel: string
        ) => {
            const mesh = new THREE.Mesh(geo, panelMat);
            mesh.position.set(x, y, z);
            mesh.userData = { name, sizeLabel };
            scene.add(mesh);
            panels.push(mesh);
        };

        // Cabinet panels
        addPanel("Left Side",  new THREE.BoxGeometry(t, h, d), -w / 2, h / 2, 0, `${height} × ${depth} mm`);
        addPanel("Right Side", new THREE.BoxGeometry(t, h, d),  w / 2, h / 2, 0, `${height} × ${depth} mm`);
        addPanel("Top",        new THREE.BoxGeometry(w, t, d),  0, h, 0, `${width} × ${depth} mm`);
        addPanel("Bottom",     new THREE.BoxGeometry(w, t, d),  0, 0, 0, `${width} × ${depth} mm`);

        if (showBack) {
            addPanel("Back", new THREE.BoxGeometry(w, h, t), 0, h / 2, -d / 2, `${width} × ${height} mm`);
        }

        for (let i = 1; i <= shelves; i++) {
            addPanel(
                `Shelf ${i}`,
                new THREE.BoxGeometry(w - t * 2, t, d - t),
                0,
                (h / (shelves + 1)) * i,
                0,
                `${width - t * 2 * 1000} × ${depth - t * 1000} mm`
            );
        }

        // ---------- LABEL ----------
        const label = makeLabel("");
        label.visible = false;
        scene.add(label);

        // ---------- RAYCASTER ----------
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let lastHit: THREE.Mesh | null = null;

        const onMove = (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(panels);

            if (hits.length) {
                const hit = hits[0].object as THREE.Mesh;
                if (lastHit && lastHit !== hit) {
                    (lastHit.material as THREE.Material) = panelMat;
                }
                hit.material = highlightMat;
                label.visible = true;
                label.position.copy(hit.position).add(new THREE.Vector3(0, 0.15, 0));
                updateLabel(label, `${hit.userData.name}\n${hit.userData.sizeLabel}`);
                lastHit = hit;
            } else {
                if (lastHit) {
                    lastHit.material = panelMat;
                    lastHit = null;
                }
                label.visible = false;
            }
        };

        renderer.domElement.addEventListener("mousemove", onMove);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
            renderer.domElement.removeEventListener("mousemove", onMove);
        };
    }, [width, height, depth, shelves, showBack]);

    return (
        <div
            ref={mountRef}
            style={{
                width: "500px",
                height: "300px",
                border: "1px solid #999",
            }}
        />
    );
}

// ---------- LABEL HELPERS ----------
function makeLabel(text: string) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, c.width / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
}

function updateLabel(sprite: THREE.Sprite, text: string) {
    const canvas = sprite.material.map!.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    text.split("\n").forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 + i * 18);
    });
    sprite.material.map!.needsUpdate = true;
}
