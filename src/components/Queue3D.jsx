import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

const QueueBox = ({ value, position, index, isHighlighted, isFront }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && (isHighlighted || isFront)) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const getColor = () => {
    if (isFront) return '#10b981'; // Green for front
    if (isHighlighted) return '#fbbf24'; // Yellow for highlighted
    return '#3b82f6'; // Blue default
  };

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshStandardMaterial 
          color={getColor()} 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.25}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        {isFront ? 'FRONT' : `[${index}]`}
      </Text>
    </group>
  );
};

const Queue3D = ({ queue, highlightedIndex = -1 }) => {
  return (
    <Canvas
      camera={{ position: [0, 4, 12], fov: 50 }}
      style={{ height: '500px', background: '#1a1a2e' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {queue.map((value, index) => (
        <QueueBox
          key={`${index}-${value}`}
          value={value}
          position={[(index - queue.length / 2) * 2, 0, 0]}
          index={index}
          isHighlighted={index === highlightedIndex}
          isFront={index === 0}
        />
      ))}
      
      {queue.length > 0 && (
        <>
          <Text
            position={[(0 - queue.length / 2) * 2 - 0.8, 1.8, 0]}
            fontSize={0.3}
            color="#10b981"
            anchorX="right"
          >
            DEQUEUE
          </Text>
          <Text
            position={[(queue.length - 1 - queue.length / 2) * 2 + 0.8, 1.8, 0]}
            fontSize={0.3}
            color="#ef4444"
            anchorX="left"
          >
            ENQUEUE
          </Text>
        </>
      )}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  );
};

export default Queue3D;
