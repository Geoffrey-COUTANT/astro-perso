import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import RotatingEarth from './RotatingEarth';

function EarthScene() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 70 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <RotatingEarth />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default EarthScene;
