import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../App';
import { AMBIENCE_SETTINGS } from '../types';
import { HouseStructure } from './structure/HouseStructure';
import { LivingRoomFurniture } from './furniture/LivingRoomFurniture';
import { BedroomFurniture } from './furniture/BedroomFurniture';

export const Scene: React.FC = () => {
  const { ambience, currentRoom, lightsOn } = useAppStore();
  
  // We store initial settings in a ref to set initial props.
  // We do NOT pass dynamic settings to props to avoid R3F re-render snapping.
  // Instead, we animate the refs in useFrame.
  const initialSettings = useRef(AMBIENCE_SETTINGS[ambience]);
  
  const controlsRef = useRef<any>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const livingLightRef = useRef<THREE.PointLight>(null);
  const bedLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const cameraStep = 2 * delta;
    const lightStep = 3 * delta; // Speed of light transition

    // --- 1. Camera Movement Interpolation ---
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (currentRoom === 'living') {
      targetPos.set(-2, 4, 8);
      targetLook.set(-2, 1, 0);
    } else if (currentRoom === 'bedroom') {
      targetPos.set(6, 4, 8);
      targetLook.set(6, 1, 0);
    } else {
      targetPos.set(10, 12, 10);
      targetLook.set(2, 0, 0);
    }

    state.camera.position.lerp(targetPos, cameraStep);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook, cameraStep);
      controlsRef.current.update();
    }

    // --- 2. Lighting & Ambience Interpolation ---
    const targetSettings = AMBIENCE_SETTINGS[ambience];
    const targetBulbColor = new THREE.Color(targetSettings.bulbColor);

    // Ambient Light
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity, 
        targetSettings.ambientIntensity, 
        lightStep
      );
    }

    // Directional Light (Sun/Moon)
    if (dirLightRef.current) {
      const targetDirIntensity = ambience === 'midnight' ? 0.2 : 1;
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetDirIntensity,
        lightStep
      );
    }

    // Room Lights (Intensity & Color)
    const activeIntensity = lightsOn ? targetSettings.bulbIntensity : 0;

    // Living Room Bulb
    if (livingLightRef.current) {
      livingLightRef.current.intensity = THREE.MathUtils.lerp(
        livingLightRef.current.intensity,
        activeIntensity,
        lightStep
      );
      livingLightRef.current.color.lerp(targetBulbColor, lightStep);
    }

    // Bedroom Bulb
    if (bedLightRef.current) {
      bedLightRef.current.intensity = THREE.MathUtils.lerp(
        bedLightRef.current.intensity,
        activeIntensity,
        lightStep
      );
      bedLightRef.current.color.lerp(targetBulbColor, lightStep);
    }
  });

  return (
    <>
      {/* Lights with refs for animation. Initial props set once to avoid snaps. */}
      <ambientLight 
        ref={ambientRef} 
        intensity={initialSettings.current.ambientIntensity} 
      />
      
      <directionalLight 
        ref={dirLightRef}
        position={[10, 20, 5]} 
        intensity={ambience === 'midnight' ? 0.2 : 1} 
        castShadow 
        shadow-bias={-0.0001}
      >
         <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      {/* Living Room Light */}
      <pointLight 
        ref={livingLightRef}
        position={[-2, 6, 0]} 
        intensity={lightsOn ? initialSettings.current.bulbIntensity : 0} 
        color={initialSettings.current.bulbColor} 
        distance={15} 
        decay={2} 
        castShadow 
      />
      
      {/* Bedroom Light */}
      <pointLight 
        ref={bedLightRef}
        position={[6, 6, 0]} 
        intensity={lightsOn ? initialSettings.current.bulbIntensity : 0} 
        color={initialSettings.current.bulbColor} 
        distance={15} 
        decay={2} 
        castShadow 
      />

      <group position={[0, -1, 0]}>
        <HouseStructure />
        
        <group position={[-2, 0, 0]}>
            <LivingRoomFurniture />
        </group>

        <group position={[6, 0, 0]}>
            <BedroomFurniture />
        </group>

        {/* Contact shadows for grounding */}
        <ContactShadows 
            resolution={1024} 
            scale={40} 
            blur={2} 
            opacity={0.5} 
            far={10} 
            color={initialSettings.current.shadowColor} 
            key={ambience} // Force re-render shadows only on ambience switch if needed, or remove key for static color
        />
      </group>
      
      <OrbitControls 
        ref={controlsRef} 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.1} 
        enablePan={false}
      />
    </>
  );
};