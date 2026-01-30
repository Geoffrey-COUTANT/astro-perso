import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const ROTATION_SPEED = 0.005;
const MAX_POLAR = Math.PI / 2 - 0.2;

function EarthPlanet() {
    const earthRef = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const lastPointer = useRef({ x: 0, y: 0 });
    const { gl } = useThree();

    const earthTexture = useTexture(
        require('../img/8k_earth_daymap.jpg')
    );

    useFrame((state, delta) => {
        if (earthRef.current && !isDragging) {
            earthRef.current.rotation.y += delta * 0.1;
        }
    });

    const handlePointerDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);
        lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (e) => {
            if (!earthRef.current) return;
            const dx = e.clientX - lastPointer.current.x;
            const dy = e.clientY - lastPointer.current.y;
            earthRef.current.rotation.y += dx * ROTATION_SPEED;
            earthRef.current.rotation.x = THREE.MathUtils.clamp(
                earthRef.current.rotation.x + dy * ROTATION_SPEED,
                -MAX_POLAR,
                MAX_POLAR
            );
            lastPointer.current = { x: e.clientX, y: e.clientY };
        };

        const handleUp = () => setIsDragging(false);

        document.addEventListener('pointermove', handleMove);
        document.addEventListener('pointerup', handleUp);
        document.addEventListener('pointerleave', handleUp);
        return () => {
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerup', handleUp);
            document.removeEventListener('pointerleave', handleUp);
        };
    }, [isDragging]);

    useEffect(() => {
        const el = gl.domElement;
        if (isDragging) el.style.cursor = 'grabbing';
        else if (isOver) el.style.cursor = 'grab';
        else el.style.cursor = 'default';
    }, [isDragging, isOver, gl.domElement]);

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

            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 3, 5]} intensity={2.5} />
            <directionalLight position={[-5, -3, -5]} intensity={1.0} color="#ffffff" />
            <pointLight position={[-5, -3, -5]} intensity={0.8} color="#4a90e2" />

            <mesh
                ref={earthRef}
                onPointerDown={handlePointerDown}
                onPointerOver={() => setIsOver(true)}
                onPointerOut={() => setIsOver(false)}
            >
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    map={earthTexture}
                    shininess={100}
                    specular={new THREE.Color(0x666666)}
                    emissive={new THREE.Color(0x000000)}
                    emissiveIntensity={0.1}
                />
            </mesh>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                autoRotate={false}
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
