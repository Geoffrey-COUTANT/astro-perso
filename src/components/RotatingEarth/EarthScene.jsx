import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import RotatingEarth from './RotatingEarth';

function EarthScene() {
    const [contextLost, setContextLost] = useState(false);
    const cleanupRef = useRef(null);

    const onCreated = useCallback(({ gl }) => {
        const canvas = gl.domElement;
        const handleContextLost = (e) => {
            e.preventDefault();
            setContextLost(true);
        };
        const handleContextRestored = () => setContextLost(false);
        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);
        cleanupRef.current = () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, []);

    useEffect(() => () => { cleanupRef.current?.(); }, []);

    if (contextLost) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-transparent">
                <p className="text-white/80 text-sm text-center px-4">
                    Affichage 3D suspendu (onglet en arrière-plan ou limite du navigateur).
                    <br />
                    <button
                        type="button"
                        onClick={() => setContextLost(false)}
                        className="mt-2 underline hover:no-underline"
                    >
                        Réafficher le globe
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 70 }}
                style={{ background: 'transparent' }}
                onCreated={onCreated}
            >
                <Suspense fallback={null}>
                    <RotatingEarth />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default EarthScene;
