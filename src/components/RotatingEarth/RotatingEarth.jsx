import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function EarthPlanet() {
    const earthRef = useRef();

    // Utiliser la texture locale de la Terre
    const earthTexture = useTexture(
        require('../img/8k_earth_daymap.jpg')
    );

    // Textures optionnelles (normal map, specular map, clouds)
    // Si vous avez ces fichiers, ajoutez-les dans le dossier img et décommentez les lignes ci-dessous
    // const normalMap = useTexture(require('../img/earth_normal.jpg'));
    // const specularMap = useTexture(require('../img/earth_specular.jpg'));
    // const cloudTexture = useTexture(require('../img/earth_clouds.jpg'));

    // Rotation de la Terre
    useFrame((state, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <>
            <Stars 
                radius={300} 
                depth={60} 
                count={2000} 
                factor={7} 
                saturation={0} 
                fade 
            />
            
            {/* Lumière ambiante - augmentée pour éclaircir la planète */}
            <ambientLight intensity={1.0} />
            
            {/* Lumière directionnelle (soleil) - intensité augmentée */}
            <directionalLight position={[5, 3, 5]} intensity={2.5} />
            <directionalLight position={[-5, -3, -5]} intensity={1.0} color="#ffffff" />
            <pointLight position={[-5, -3, -5]} intensity={0.8} color="#4a90e2" />
            
            {/* Planète Terre - taille ajustée pour l'arrière-plan */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshPhongMaterial
                    map={earthTexture}
                    shininess={100}
                    specular={new THREE.Color(0x666666)}
                    emissive={new THREE.Color(0x000000)}
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Contrôles de la caméra */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
            />
        </>
    );
}

function RotatingEarth() {
    return (
        <Suspense fallback={null}>
            <EarthPlanet />
        </Suspense>
    );
}

export default RotatingEarth;
