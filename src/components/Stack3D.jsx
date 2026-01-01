import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

const StackBox = ({ value, position, index, isHighlighted }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 0.8, 2]} />
        <meshStandardMaterial 
          color={isHighlighted ? '#fbbf24' : '#3b82f6'} 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      <Text
        position={[-1.2, 0, 0]}
        fontSize={0.3}
        color="#888"
        anchorX="right"
        anchorY="middle"
      >
        [{index}]
      </Text>
    </group>
  );
};

const Stack3D = ({ stack, highlightedIndex = -1 }) => {
  return (
    <Canvas
      camera={{ position: [5, 5, 8], fov: 50 }}
      style={{ height: '500px', background: '#1a1a2e' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {stack.map((value, index) => (
        <StackBox
          key={`${index}-${value}`}
          value={value}
          position={[0, index * 1, 0]}
          index={index}
          isHighlighted={index === highlightedIndex}
        />
      ))}
      
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  );
};

export default Stack3D;
