import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';

const TreeNode = ({ value, position, isHighlighted, highlightIndex }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.003) * 0.2;
    }
  });

  const getColor = () => {
    if (!isHighlighted) return '#3b82f6';
    
    // Rainbow colors based on highlight index for traversal animation
    const colors = ['#ff00ff', '#ff00aa', '#ff0055', '#ff5500', '#ffaa00', '#ffff00', '#00ff00'];
    return colors[highlightIndex % colors.length] || '#fbbf24';
  };

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={getColor()}
          metalness={0.8}
          roughness={0.2}
          emissive={isHighlighted ? getColor() : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : 0}
        />
      </mesh>
      {isHighlighted && (
        <>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshBasicMaterial 
              color={getColor()}
              transparent
              opacity={0.2}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshBasicMaterial 
              color={getColor()}
              transparent
              opacity={0.1}
            />
          </mesh>
        </>
      )}
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.35}
        color={isHighlighted ? "#000" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const TreeEdge = ({ start, end, isHighlighted }) => {
  return (
    <Line
      points={[start, end]}
      color={isHighlighted ? "#00ffff" : "#888"}
      lineWidth={isHighlighted ? 4 : 2}
    />
  );
};

const BinaryTree3D = ({ tree, highlightedNodes = [] }) => {
  const positions = useMemo(() => {
    if (!tree || tree.length === 0) return [];
    
    const calculatePositions = (arr) => {
      const positions = [];
      const levelHeight = 2;
      
      const getPosition = (index, level, posInLevel, totalAtLevel) => {
        const y = -level * levelHeight;
        const levelWidth = Math.pow(2, level + 1) * 2;
        const x = (posInLevel - totalAtLevel / 2) * (levelWidth / totalAtLevel);
        return [x, y, 0];
      };
      
      let currentLevel = 0;
      let nodesInLevel = 1;
      let processedNodes = 0;
      
      for (let i = 0; i < arr.length; i++) {
        if (processedNodes >= nodesInLevel) {
          currentLevel++;
          nodesInLevel *= 2;
          processedNodes = 0;
        }
        
        const posInLevel = processedNodes;
        positions.push({
          value: arr[i],
          position: getPosition(i, currentLevel, posInLevel, nodesInLevel),
          index: i,
          leftChild: 2 * i + 1 < arr.length ? 2 * i + 1 : -1,
          rightChild: 2 * i + 2 < arr.length ? 2 * i + 2 : -1
        });
        
        processedNodes++;
      }
      
      return positions;
    };
    
    return calculatePositions(tree);
  }, [tree]);

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      style={{ height: '500px', background: '#1a1a2e' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {positions.map((node, idx) => (
        <React.Fragment key={`node-${idx}`}>
          {node.leftChild !== -1 && positions[node.leftChild] && (
            <TreeEdge
              start={node.position}
              end={positions[node.leftChild].position}
              isHighlighted={highlightedNodes.includes(idx) && highlightedNodes.includes(node.leftChild)}
            />
          )}
          {node.rightChild !== -1 && positions[node.rightChild] && (
            <TreeEdge
              start={node.position}
              end={positions[node.rightChild].position}
              isHighlighted={highlightedNodes.includes(idx) && highlightedNodes.includes(node.rightChild)}
            />
          )}
          <TreeNode
            value={node.value}
            position={node.position}
            isHighlighted={highlightedNodes.includes(idx)}
            highlightIndex={highlightedNodes.indexOf(idx)}
          />
        </React.Fragment>
      ))}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  );
};

export default BinaryTree3D;
