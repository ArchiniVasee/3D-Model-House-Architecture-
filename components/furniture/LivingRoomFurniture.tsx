import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../App';
import * as THREE from 'three';

export const LivingRoomFurniture: React.FC = () => {
  const { tvOn, fanOn } = useAppStore();
  const fanRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (fanOn && fanRef.current) {
      fanRef.current.rotation.y += delta * 5;
    }
  });

  return (
    <group>
      {/* --- TV Set --- */}
      <group position={[0, 1.5, -3.5]}>
        {/* Stand */}
        <mesh position={[0, -1, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 1, 0.8]} />
            <meshStandardMaterial color="#333" roughness={0.2} />
        </mesh>
        {/* Screen Bezel */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 1.3, 0.1]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 0.2, 0.06]}>
            <planeGeometry args={[2, 1.1]} />
            <meshStandardMaterial 
                color={tvOn ? "#white" : "#111"} 
                emissive={tvOn ? "#aaccff" : "#000"}
                emissiveIntensity={tvOn ? 1.5 : 0}
            />
        </mesh>
        {/* TV Light Glow (only when on) */}
        {tvOn && <pointLight position={[0, 0, 1]} intensity={2} color="#aaccff" distance={5} />}
      </group>

      {/* --- Sofa --- */}
      <group position={[0, 0.5, 2]}>
        {/* Base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.8, 1]} />
            <meshStandardMaterial color="#5e4b35" roughness={0.9} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.6, 0.3]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.6, 0.4]} />
            <meshStandardMaterial color="#5e4b35" roughness={0.9} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-1.6, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.6, 1]} />
            <meshStandardMaterial color="#4a3b2a" />
        </mesh>
        <mesh position={[1.6, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.6, 1]} />
            <meshStandardMaterial color="#4a3b2a" />
        </mesh>
      </group>

      {/* --- Coffee Table --- */}
      <group position={[0, 0.4, 0]}>
         <mesh castShadow receiveShadow>
             <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
             <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
         </mesh>
         <mesh position={[0, -0.2, 0]} castShadow>
             <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
             <meshStandardMaterial color="#111" />
         </mesh>
      </group>

      {/* --- Ceiling Fan (Detailed Model) --- */}
      <group position={[0, 3.5, 0]}>
        {/* Mounting Rod & Canopy */}
        <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6]} />
            <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
             <cylinderGeometry args={[0.12, 0.12, 0.1]} />
             <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        
        {/* Main Motor Housing (Stationary) */}
        <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.22, 0.25, 32]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Rotating Assembly */}
        <group ref={fanRef} position={[0, -0.12, 0]}>
             {/* Central Hub for Blades */}
             <mesh position={[0, 0, 0]}>
                 <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                 <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.2} />
             </mesh>
             
             {/* 5 Blades for a regular look */}
             {[0, 1, 2, 3, 4].map((i) => (
                 <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
                     {/* Blade Iron (Connector) */}
                     <mesh position={[0.25, 0, 0]}>
                        <boxGeometry args={[0.2, 0.02, 0.06]} />
                        <meshStandardMaterial color="#111" />
                     </mesh>
                     {/* Blade - Tapered look with pitch */}
                     <mesh position={[1.0, 0, 0]} rotation={[0.1, 0, 0]} castShadow>
                         <boxGeometry args={[1.5, 0.02, 0.25]} />
                         <meshStandardMaterial color="#5c4033" roughness={0.6} /> {/* Dark Walnut Wood */}
                     </mesh>
                 </group>
             ))}
        </group>
        
        {/* Light Kit (Bottom Glass) */}
        <mesh position={[0, -0.25, 0]}>
            <sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color="white" 
              roughness={0.2} 
              opacity={0.9} 
              transparent 
              side={THREE.DoubleSide}
            />
        </mesh>
        {/* Light Kit Rim */}
        <mesh position={[0, -0.17, 0]}>
             <torusGeometry args={[0.14, 0.01, 16, 32]} />
             <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};