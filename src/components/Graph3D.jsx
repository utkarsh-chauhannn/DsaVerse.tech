import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';

const GraphNode = ({ value, position, isHighlighted }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={isHighlighted ? '#fbbf24' : '#10b981'} 
          metalness={0.3}
          roughness={0.4}
          emissive={isHighlighted ? '#fbbf24' : '#10b981'}
          emissiveIntensity={isHighlighted ? 0.35 : 0.05}
        />
      </mesh>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const GraphEdge = ({ start, end, directed = false }) => {
  const points = [start, end];
  
  return (
    <Line
      points={points}
      color="#888"
      lineWidth={2}
    />
  );
};

const Graph3D = ({ graphData, highlightedNode = null, highlightedNodes = null }) => {
  const { nodes, edges } = graphData;

  const highlightedSet = useMemo(() => {
    if (Array.isArray(highlightedNodes)) return new Set(highlightedNodes);
    if (highlightedNode != null) return new Set([highlightedNode]);
    return new Set();
  }, [highlightedNode, highlightedNodes]);
  
  const nodePositions = useMemo(() => {
    const positions = {};
    const nodeCount = nodes.length;
    const radius = Math.max(3, nodeCount * 0.5);
    
    nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * Math.PI * 2;
      positions[node] = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ];
    });
    
    return positions;
  }, [nodes]);

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      style={{ height: '500px', background: '#1a1a2e' }}
      shadows
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 12, 10]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, 6, -10]} intensity={0.35} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.1} roughness={0.9} />
      </mesh>
      
      {edges.map((edge, idx) => (
        <GraphEdge
          key={`edge-${idx}`}
          start={nodePositions[edge.from]}
          end={nodePositions[edge.to]}
        />
      ))}
      
      {nodes.map((node) => (
        <GraphNode
          key={node}
          value={node}
          position={nodePositions[node]}
          isHighlighted={highlightedSet.has(node)}
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

export default Graph3D;
