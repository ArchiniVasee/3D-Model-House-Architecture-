import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WALL_THICKNESS = 0.2;
const WALL_HEIGHT = 4;
const ROOM_DEPTH = 8;
const LIVING_WIDTH = 8;
const BEDROOM_WIDTH = 8;

const DOOR_WIDTH = 2; 
const DOOR_HEIGHT = 3; 

const Door: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  // Use a ref for state to ensure the animation loop always has the latest value
  const isOpenRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);

  const toggleDoor = (e: any) => {
    e.stopPropagation();
    isOpenRef.current = !isOpenRef.current;
    setOpen(isOpenRef.current);
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
        // Swing -100 degrees to open nicely into the room
        const targetRotation = isOpenRef.current ? -Math.PI / 1.8 : 0; 
        
        // Smooth damping for a realistic hinge feel
        // damp(current, target, lambda, delta)
        groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            targetRotation,
            4, 
            delta
        );
    }
  });

  return (
    <group position={[0, -WALL_HEIGHT/2, -DOOR_WIDTH/2]}> {/* Pivot at the bottom-left jamb */}
        <group ref={groupRef}>
            {/* --- Door Pivot Group (Rotates around Y axis at 0,0,0) --- */}
            
            {/* The Door Slab - Offset by half width so it fills the frame from the pivot */}
            <group position={[0, DOOR_HEIGHT/2, DOOR_WIDTH/2]}>
                
                {/* Main Frame of Door */}
                <mesh 
                    castShadow receiveShadow
                    onClick={toggleDoor}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                    <boxGeometry args={[0.08, DOOR_HEIGHT, DOOR_WIDTH]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.4} /> {/* Dark Wood */}
                </mesh>

                {/* Frosted Glass Insert for Modern Look */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.09, DOOR_HEIGHT - 0.4, DOOR_WIDTH - 0.4]} />
                    <meshPhysicalMaterial 
                        color="#aaccff" 
                        roughness={0.2} 
                        transmission={0.6} 
                        thickness={0.1}
                        transparent
                        opacity={0.8}
                    />
                </mesh>

                {/* Vertical Handle - Front */}
                <mesh position={[0.08, 0, DOOR_WIDTH/2 - 0.3]} onClick={toggleDoor}>
                    <boxGeometry args={[0.04, 0.8, 0.04]} />
                    <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Vertical Handle - Back */}
                <mesh position={[-0.08, 0, DOOR_WIDTH/2 - 0.3]} onClick={toggleDoor}>
                    <boxGeometry args={[0.04, 0.8, 0.04]} />
                    <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
                </mesh>

            </group>
        </group>
    </group>
  );
};

export const HouseStructure: React.FC = () => {
  return (
    <group>
      {/* Floor - Entire House */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0, 0]} receiveShadow>
        <planeGeometry args={[LIVING_WIDTH + BEDROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>

      {/* Living Room Walls */}
      <group position={[-2, WALL_HEIGHT / 2, 0]}>
        {/* Back Wall */}
        <mesh position={[0, 0, -ROOM_DEPTH / 2]} receiveShadow castShadow>
          <boxGeometry args={[LIVING_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-LIVING_WIDTH / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[ROOM_DEPTH, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>

      {/* Bedroom Walls */}
      <group position={[6, WALL_HEIGHT / 2, 0]}>
        {/* Back Wall */}
        <mesh position={[0, 0, -ROOM_DEPTH / 2]} receiveShadow castShadow>
          <boxGeometry args={[BEDROOM_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color="#e6e6fa" /> 
        </mesh>
        {/* Right Wall */}
        <mesh position={[BEDROOM_WIDTH / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[ROOM_DEPTH, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color="#e6e6fa" />
        </mesh>
      </group>

      {/* Middle Partition with Doorway */}
      <group position={[2, WALL_HEIGHT / 2, 0]}>
         {/* Wall Segment 1 (Z < -1) */}
         <mesh position={[0, 0, -2.5]} receiveShadow castShadow>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, 3]} />
            <meshStandardMaterial color="#dcdcdc" />
         </mesh>

         {/* Wall Segment 2 (Z > 1) */}
         <mesh position={[0, 0, 2.5]} receiveShadow castShadow>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, 3]} />
            <meshStandardMaterial color="#dcdcdc" />
         </mesh>

         {/* Header (Above Door) */}
         <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
            <boxGeometry args={[WALL_THICKNESS, 1, DOOR_WIDTH]} />
            <meshStandardMaterial color="#dcdcdc" />
         </mesh>

         {/* --- Door Frame --- */}
         {/* Post 1 */}
         <mesh position={[0, -0.5, -1]} receiveShadow>
             <boxGeometry args={[0.22, DOOR_HEIGHT, 0.15]} />
             <meshStandardMaterial color="#2c1a12" />
         </mesh>
         {/* Post 2 */}
         <mesh position={[0, -0.5, 1]} receiveShadow>
             <boxGeometry args={[0.22, DOOR_HEIGHT, 0.15]} />
             <meshStandardMaterial color="#2c1a12" />
         </mesh>
         {/* Lintel */}
         <mesh position={[0, 1, 0]} receiveShadow>
             <boxGeometry args={[0.24, 0.15, 2.2]} />
             <meshStandardMaterial color="#2c1a12" />
         </mesh>

         {/* Interactive Swinging Door */}
         <Door />
      </group>
    </group>
  );
};