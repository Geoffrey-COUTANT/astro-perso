import React, { useEffect } from 'react';
import * as THREE from 'three';

const Planet = () => {
    useEffect(() => {
        // Création de la scène
        const scene = new THREE.Scene();

        // Création de la caméra
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Création du rendu
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('planet-container').appendChild(renderer.domElement);

        // Création de la géométrie de la planète (sphère)
        const geometry = new THREE.SphereGeometry(1, 32, 32);

        // Chargement de la texture de la planète
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(
            '../img/planet.jpg', // Remplace par le chemin correct de ton image
            () => { console.log('Texture loaded successfully!'); },
            undefined,
            (error) => { console.error('Error loading texture:', error); }
        );

        // Matériau de la planète avec texture
        const material = new THREE.MeshStandardMaterial({ map: texture });

        // Création de la planète et ajout à la scène
        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);

        // Lumière directionnelle pour éclairer la planète
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        // Lumière ambiante douce pour la scène
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Fonction d'animation de la scène
        const animate = () => {
            requestAnimationFrame(animate);
            planet.rotation.y += 0.01; // Rotation de la planète
            renderer.render(scene, camera);
        };

        // Fonction de redimensionnement pour garder l'aspect correct
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Lancer l'animation
        animate();

        // Nettoyer les ressources lorsque le composant est démonté
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            id="planet-container"
            className="w-full h-screen bg-black flex justify-center items-center"
        />
    );
};

export default Planet;
