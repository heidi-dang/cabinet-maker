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

        /* ================= SCENE ================= */
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

        /* ================= MATERIALS ================= */
        const normalMat = new THREE.MeshStandardMaterial({
            color: 0xe5e7eb,
        });

        const highlightMat = new THREE.MeshStandardMaterial({
            color: 0xffeb3b, // CAD yellow
        });

        /* ================= SCALE ================= */
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
            label: string
        ) => {
            const mesh = new THREE.Mesh(geo, normalMat);
            mesh.position.set(x, y, z);
            mesh.userData = { name, label };
            scene.add(mesh);
            panels.push(mesh);

            const edges = new THREE.LineSegments(
                new THREE.EdgesGeometry(geo),
                new THREE.LineBasicMaterial({ color: 0x000000 })
            );
            edges.position.copy(mesh.position);
            scene.add(edges);
        };

        /* ================= CABINET ================= */
        addPanel("LEFT SIDE",  new THREE.BoxGeometry(t, h, d), -w / 2, h / 2, 0, `${height} × ${depth} mm`);
        addPanel("RIGHT SIDE", new THREE.BoxGeometry(t, h, d),  w / 2, h / 2, 0, `${height} × ${depth} mm`);
        addPanel("TOP",        new THREE.BoxGeometry(w, t, d),  0, h, 0, `${width} × ${depth} mm`);
        addPanel("BOTTOM",     new THREE.BoxGeometry(w, t, d),  0, 0, 0, `${width} × ${depth} mm`);

        if (showBack) {
            addPanel("BACK", new THREE.BoxGeometry(w, h, t), 0, h / 2, -d / 2, `${width} × ${height} mm`);
        }

        for (let i = 1; i <= shelves; i++) {
            addPanel(
                `SHELF ${i}`,
                new THREE.BoxGeometry(w - t * 2, t, d - t),
                0,
                (h / (shelves + 1)) * i,
                0,
                `${width - t * 2 * 1000} × ${depth - t * 1000} mm`
            );
        }

        /* ================= LABEL ================= */
        const labelSprite = createLabel("");
        labelSprite.visible = false;
        scene.add(labelSprite);

        /* ================= RAYCAST ================= */
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let active: THREE.Mesh | null = null;

        const onMove = (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const hit = raycaster.intersectObjects(panels)[0];

            if (hit) {
                const mesh = hit.object as THREE.Mesh;
                if (active && active !== mesh) active.material = normalMat;
                mesh.material = highlightMat;
                active = mesh;

                labelSprite.visible = true;
                labelSprite.position.copy(mesh.position).add(new THREE.Vector3(0, 0.25, 0));
                updateLabel(labelSprite, mesh.userData.name, mesh.userData.label);
                labelSprite.quaternion.copy(camera.quaternion);
            } else {
                if (active) active.material = normalMat;
                active = null;
                labelSprite.visible = false;
            }
        };

        renderer.domElement.addEventListener("mousemove", onMove);

        /* ================= RENDER LOOP ================= */
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
                border: "1px solid #666",
                background: "#fff",
            }}
        />
    );
}

/* ================= LABEL HELPERS ================= */
function createLabel(text: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 120;
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
}

function updateLabel(sprite: THREE.Sprite, title: string, size: string) {
    const canvas = sprite.material.map!.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffeb3b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 42);

    ctx.font = "20px Arial";
    ctx.fillText(size, canvas.width / 2, 78);

    sprite.material.map!.needsUpdate = true;
    sprite.scale.set(0.9, 0.36, 1);
}
