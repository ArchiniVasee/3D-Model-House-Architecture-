import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../App';
import { AMBIENCE_SETTINGS } from '../../types';

export const BedroomFurniture: React.FC = () => {
  const { lightsOn, ambience } = useAppStore();
  const lightRef = useRef<THREE.PointLight>(null);
  const bulbMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const settings = AMBIENCE_SETTINGS[ambience];
    const targetIntensity = lightsOn ? 1.5 : 0;
    const targetColor = new THREE.Color(settings.bulbColor);

    // Smoothly interpolate light intensity and color
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 3);
      lightRef.current.color.lerp(targetColor, delta * 3);
    }

    // Smoothly interpolate bulb emissive glow
    if (bulbMatRef.current) {
      bulbMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(bulbMatRef.current.emissiveIntensity, lightsOn ? 2 : 0, delta * 3);
      bulbMatRef.current.emissive.lerp(targetColor, delta * 3);
    }
  });

  return (
    <group>
      {/* --- Detailed Bed Model --- */}
      <group position={[0, 0, -2]}>
        
        {/* Legs */}
        <mesh position={[-1.1, 0.15, -1.6]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.3]} />
            <meshStandardMaterial color="#2c1a12" />
        </mesh>
        <mesh position={[1.1, 0.15, -1.6]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.3]} />
            <meshStandardMaterial color="#2c1a12" />
        </mesh>
        <mesh position={[-1.1, 0.15, 1.6]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.3]} />
            <meshStandardMaterial color="#2c1a12" />
        </mesh>
        <mesh position={[1.1, 0.15, 1.6]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.3]} />
            <meshStandardMaterial color="#2c1a12" />
        </mesh>

        {/* Bed Frame Platform */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.2, 3.4]} />
            <meshStandardMaterial color="#3E2723" roughness={0.8} />
        </mesh>

        {/* Mattress */}
        <mesh position={[0, 0.65, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.3, 3.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} /> 
        </mesh>

        {/* Headboard Group */}
        <group position={[0, 0.9, -1.65]}>
             {/* Wooden Backing */}
             <mesh castShadow receiveShadow>
                <boxGeometry args={[2.6, 1.2, 0.1]} />
                <meshStandardMaterial color="#3E2723" roughness={0.6} />
             </mesh>
             {/* Upholstered Padding */}
             <mesh position={[0, 0, 0.06]} receiveShadow>
                <boxGeometry args={[2.4, 1.0, 0.05]} />
                <meshStandardMaterial color="#5D4037" roughness={0.9} />
             </mesh>
        </group>

        {/* Duvet / Comforter */}
        <mesh position={[0, 0.68, 0.6]} castShadow receiveShadow>
             <boxGeometry args={[2.26, 0.32, 2.2]} />
             <meshStandardMaterial color="#8d99ae" roughness={1} />
        </mesh>

        {/* Pillows */}
        <group position={[0, 0.85, -1.2]}>
            <mesh position={[-0.6, 0, 0]} rotation={[0.4, 0, 0]} castShadow>
                <boxGeometry args={[0.7, 0.15, 0.45]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
            <mesh position={[0.6, 0, 0]} rotation={[0.4, 0, 0]} castShadow>
                <boxGeometry args={[0.7, 0.15, 0.45]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
        </group>

      </group>

      {/* --- Modern Floor Lamp --- */}
      <group position={[-2, 0, -2]}>
          {/* Base */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 1.4, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 2.8, 16]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 2.6, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.35, 0.6, 32, 1, true]} />
              <meshStandardMaterial color="#fafafa" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          {/* Bulb / Light Source */}
          <group position={[0, 2.5, 0]}>
             <mesh>
                 <sphereGeometry args={[0.08]} />
                 <meshStandardMaterial 
                    ref={bulbMatRef}
                    color="white"
                    toneMapped={false}
                 />
             </mesh>
             <pointLight 
                ref={lightRef}
                distance={6} 
                decay={2} 
                castShadow
                shadow-bias={-0.0001}
             />
          </group>
      </group>

       {/* --- Rug --- */}
       <mesh position={[0, 0.02, 1]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
           <circleGeometry args={[1.5, 32]} />
           <meshStandardMaterial color="#ccddee" roughness={1} />
       </mesh>
    </group>
  );
};