/**
 * TruckScene.tsx
 * The main R3F Canvas scene: truck wireframe + all cargo parts.
 * Provides OrbitControls for camera, handles part selection.
 */

import type { ScenePart, TruckBounds } from "@/types/visualizer";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { CargoBox } from "./CargoBox";

// Axis label helper rendered with a canvas texture
function TruckWireframe({ bounds }: { bounds: TruckBounds }) {
  const { lengthCm: L, widthCm: W, heightCm: H } = bounds;

  return (
    <group position={[L / 2, H / 2, W / 2]}>
      {/* Outer wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(L, H, W)]} />
        <lineBasicMaterial color={0x334155} linewidth={1} />
      </lineSegments>

      {/* Floor grid */}
      <gridHelper
        args={[Math.max(L, W), 10, 0x1e293b, 0x1e293b]}
        position={[0, -H / 2 + 0.5, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Subtle floor plane */}
      <mesh position={[0, -H / 2 + 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial
          color={0x0f172a}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// Dimension label (using a simple line marker)
function DimensionMarker({
  bounds,
}: {
  bounds: TruckBounds;
}) {
  const { lengthCm: L, widthCm: W, heightCm: H } = bounds;
  // Corner posts for visual reference
  const corners: [number, number, number][] = [
    [0, 0, 0],
    [L, 0, 0],
    [L, 0, W],
    [0, 0, W],
  ];

  return (
    <>
      {corners.map(([x, _y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, H + 5, z]}>
          <sphereGeometry args={[2, 6, 6]} />
          <meshStandardMaterial
            color={0x22d3ee}
            emissive={new THREE.Color(0x22d3ee)}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

interface TruckSceneProps {
  bounds: TruckBounds;
  parts: ScenePart[];
  selectedKey: string | null;
  onSelectPart: (key: string | null) => void;
  onPartPositionChange: (key: string, pos: [number, number, number]) => void;
  onPartRotationChange: (key: string, rot: [number, number, number]) => void;
}

export function TruckScene({
  bounds,
  parts,
  selectedKey,
  onSelectPart,
  onPartPositionChange,
  onPartRotationChange,
}: TruckSceneProps) {
  // OrbitControls ref not needed for current functionality
  const isDraggingPart = useRef(false);

  const handlePartSelect = useCallback(
    (key: string) => {
      isDraggingPart.current = true;
      onSelectPart(key);
    },
    [onSelectPart],
  );

  const handleCanvasClick = useCallback(() => {
    if (!isDraggingPart.current) {
      onSelectPart(null);
    }
    isDraggingPart.current = false;
  }, [onSelectPart]);

  const { lengthCm: L, heightCm: H, widthCm: W } = bounds;

  // Camera looks at centre of truck
  const camTarget: [number, number, number] = [L / 2, H / 2, W / 2];

  return (
    <Canvas
      style={{ background: "#0a0a0a" }}
      shadows
      camera={{
        position: [L * 1.4, H * 1.2, W * 2],
        fov: 45,
        near: 1,
        far: 10000,
      }}
      onClick={handleCanvasClick}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[L, H * 2, W]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-L, H, -W / 2]} intensity={0.3} />
      <hemisphereLight groundColor={0x0a0a14} intensity={0.2} />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Orbit controls — disabled during part drag */}
      <OrbitControls
        target={camTarget}
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 1.8}
        minDistance={50}
        maxDistance={3000}
      />

      {/* Truck wireframe */}
      <TruckWireframe bounds={bounds} />
      <DimensionMarker bounds={bounds} />

      {/* Cargo parts */}
      {parts.map((part) => (
        <CargoBox
          key={part.key}
          part={part}
          truckBounds={bounds}
          isSelected={selectedKey === part.key}
          onSelect={() => handlePartSelect(part.key)}
          onPositionChange={(pos) => onPartPositionChange(part.key, pos)}
          onRotationChange={(rot) => onPartRotationChange(part.key, rot)}
        />
      ))}
    </Canvas>
  );
}
