import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';

const Bar = ({ value, position, color, isHighlighted }) => {
  const meshRef = useRef();
  const targetHeight = Math.max(0.25, Number(value) || 0.25);

  const materialProps = useMemo(() => {
    // Keep existing color palette; just add depth via emissive.
    return {
      color,
      metalness: 0.35,
      roughness: 0.35,
      emissive: color,
      emissiveIntensity: isHighlighted ? 0.35 : 0.06
    };
  }, [color, isHighlighted]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Smoothly animate bar height changes.
    const lerpFactor = 1 - Math.pow(0.001, delta);
    meshRef.current.scale.y += (targetHeight - meshRef.current.scale.y) * lerpFactor;
  });

  return (
    <group position={position}>
      <group position={[0, targetHeight / 2, 0]}>
        <RoundedBox
          ref={meshRef}
          args={[0.9, 1, 0.9]}
          radius={0.12}
          smoothness={6}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>
      </group>
      <Text
        position={[0, -0.6, 0.7]}
        fontSize={0.38}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const Array3D = ({ array, comparison = [], swap = [], pivot = [] }) => {
  const getBarColor = (index) => {
    if (swap.includes(index)) return '#ef4444'; // Red for swap
    if (comparison.includes(index)) return '#fbbf24'; // Yellow for comparison
    if (pivot.includes(index)) return '#fbbf24'; // Yellow for pivot (reuse existing highlight)
    return '#3b82f6'; // Blue default
  };

  const getIsHighlighted = (index) => {
    return swap.includes(index) || comparison.includes(index) || pivot.includes(index);
  };

  return (
    <Canvas
      camera={{ position: [0, 8, 15], fov: 50 }}
      style={{ height: '500px', background: '#1a1a2e' }}
      shadows
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 14, 10]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, 8, -10]} intensity={0.35} />

      {/* Floor for depth and nicer shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.1} roughness={0.9} />
      </mesh>
      
      {array.map((value, index) => (
        <Bar
          key={index}
          value={value}
          position={[(index - array.length / 2) * 1.5, 0, 0]}
          color={getBarColor(index)}
          isHighlighted={getIsHighlighted(index)}
        />
      ))}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  );
};

export default Array3D;
