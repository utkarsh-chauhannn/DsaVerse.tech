import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';

const ListNode = ({ value, position, isHighlighted }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial 
          color={isHighlighted ? '#fbbf24' : '#3b82f6'} 
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
    </group>
  );
};

const Arrow = ({ start, end }) => {
  const points = [start, end];
  
  return (
    <Line
      points={points}
      color="#10b981"
      lineWidth={3}
    />
  );
};

const LinkedList3D = ({ list, highlightedIndex = -1 }) => {
  const spacing = 2;
  
  return (
    <Canvas
      camera={{ position: [0, 3, 10], fov: 50 }}
      style={{ height: '500px', background: '#1a1a2e' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {list.length > 0 && (
        <Text
          position={[(0 - list.length / 2) * spacing - 1.5, 0, 0]}
          fontSize={0.4}
          color="#10b981"
          anchorX="right"
        >
          HEAD →
        </Text>
      )}
      
      {list.map((value, index) => (
        <React.Fragment key={`${index}-${value}`}>
          <ListNode
            value={value}
            position={[(index - list.length / 2) * spacing, 0, 0]}
            isHighlighted={index === highlightedIndex}
          />
          
          {index < list.length - 1 && (
            <Arrow
              start={[(index - list.length / 2) * spacing + 0.6, 0, 0]}
              end={[(index + 1 - list.length / 2) * spacing - 0.6, 0, 0]}
            />
          )}
        </React.Fragment>
      ))}
      
      {list.length > 0 && (
        <Text
          position={[(list.length - 1 - list.length / 2) * spacing + 1.5, 0, 0]}
          fontSize={0.4}
          color="#ef4444"
          anchorX="left"
        >
          → NULL
        </Text>
      )}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  );
};

export default LinkedList3D;
