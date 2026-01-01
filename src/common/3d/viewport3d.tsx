import React, { useEffect, useRef } from "react";
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface Viewport3DProps {
    width: number;
    height: number;
    model: any;
    className?: string;
}

export function Viewport3D(props: Viewport3DProps) {
    const viewEl = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        let play: boolean = true;
        let scene = sceneRef.current = new Scene();

        var container = viewEl.current as HTMLElement;
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        var camera = new PerspectiveCamera(75, width / height, 0.1, 10000);

        var renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        var controls = new OrbitControls( camera, renderer.domElement );

        camera.position.set( 0, 20, 1000 );
        
        var animate = () => {
            if(!play)
                return;

            controls.update();            
            renderer.render(scene, camera);

            requestAnimationFrame( animate );
        }

        animate();

        return () => {
            play = false;
        }
    }, []);

    useEffect(() => {
        var scene = sceneRef.current as Scene;
        scene.children = props.model ? [props.model] : [];
    }, [props.model]);

    return <div ref={viewEl} className={props.className} style={{ width: props.width, height: props.height }}></div>
}