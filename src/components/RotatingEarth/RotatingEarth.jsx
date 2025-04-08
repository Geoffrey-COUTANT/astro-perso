import { useEffect, useRef } from "react";
import * as THREE from "three";

const RotatingEarth = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, 1, 1, 100);
        camera.position.z = 25;

        // Renderer avec transparence
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0); // Fond transparent
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(10, 100, 100);
        const material = new THREE.MeshPhongMaterial();

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1206469/earthmap1k.jpg",
            (texture) => {
                material.map = texture;
                material.transparent = true; // Active la transparence si besoin
                material.needsUpdate = true;
            }
        );

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = 0.5;
        scene.add(mesh);

        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        const animate = () => {
            mesh.rotation.y += 0.005;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="flex justify-center items-center text-gray-300 bg-white w-full h-full">arabe </div>;
};

export default RotatingEarth;
