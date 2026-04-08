/**
 * TruckScene.tsx
 * R3F Canvas: truck wireframe + cargo parts + OrbitControls.
 * Units: meters (everything divided by 100 from cm).
 * Truck box: corner at (0,0,0) — floor at y=0.
 */

import type { ScenePart, TruckBounds } from "@/types/visualizer";
import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CargoBox } from "./CargoBox";

// ─── Truck wireframe ──────────────────────────────────────────────────────────

function TruckWireframe({ bounds }: { bounds: TruckBounds }) {
  const L = bounds.lengthCm / 100;
  const W = bounds.widthCm / 100;
  const H = bounds.heightCm / 100;

  const cx = L / 2;
  const cy = H / 2;
  const cz = W / 2;

  const { edges, corners } = useMemo(() => {
    const box = new THREE.BoxGeometry(L, H, W);
    const edgesGeo = new THREE.EdgesGeometry(box);
    const cornerPositions: [number, number, number][] = [
      [0, 0, 0],
      [L, 0, 0],
      [L, 0, W],
      [0, 0, W],
      [0, H, 0],
      [L, H, 0],
      [L, H, W],
      [0, H, W],
    ];
    box.dispose();
    return { edges: edgesGeo, corners: cornerPositions };
  }, [L, W, H]);

  return (
    <group>
      {/* Wireframe edges */}
      <lineSegments geometry={edges} position={[cx, cy, cz]}>
        <lineBasicMaterial
          color={0x22d3ee}
          transparent
          opacity={0.3}
          linewidth={1}
        />
      </lineSegments>

      {/* Floor plane */}
      <mesh
        position={[cx, 0.001, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial
          color={0x0a1018}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Grid on floor */}
      <Grid
        position={[cx, 0.002, cz]}
        args={[L, W]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#1a3a3a"
        sectionSize={5}
        sectionThickness={0.6}
        sectionColor="#0e4a4a"
        fadeDistance={200}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Corner dots */}
      {corners.map(([x, y, z]) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial
            color={0x22d3ee}
            emissive={new THREE.Color(0x22d3ee)}
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene inner (inside Canvas context) ─────────────────────────────────────

interface SceneInnerProps {
  bounds: TruckBounds;
  parts: ScenePart[];
  selectedKey: string | null;
  onSelectPart: (key: string | null) => void;
  onPartPositionChange: (key: string, pos: [number, number, number]) => void;
  onPartRotationChange: (key: string, rot: [number, number, number]) => void;
  orbitEnabled: boolean;
  setOrbitEnabled: (v: boolean) => void;
}

function SceneInner({
  bounds,
  parts,
  selectedKey,
  onSelectPart,
  onPartPositionChange,
  onPartRotationChange,
  orbitEnabled,
  setOrbitEnabled,
}: SceneInnerProps) {
  const L = bounds.lengthCm / 100;
  const W = bounds.widthCm / 100;
  const H = bounds.heightCm / 100;

  const camTarget: [number, number, number] = [L / 2, H / 2, W / 2];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[L * 1.5, H * 2, W * 1.5]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
        shadow-camera-left={-L}
        shadow-camera-right={L * 2}
        shadow-camera-top={H * 2}
        shadow-camera-bottom={-H}
      />
      <directionalLight position={[-L * 0.5, H, -W * 0.5]} intensity={0.25} />

      {/* OrbitControls — rotate disabled while part is being dragged */}
      <OrbitControls
        target={camTarget}
        enablePan
        enableZoom
        enableRotate={orbitEnabled}
        maxPolarAngle={Math.PI / 1.9}
        minDistance={0.5}
        maxDistance={100}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />

      {/* Truck wireframe box */}
      <TruckWireframe bounds={bounds} />

      {/* Cargo parts */}
      {parts.map((part) => (
        <CargoBox
          key={part.key}
          part={part}
          truckBounds={bounds}
          isSelected={selectedKey === part.key}
          isDragging={selectedKey === part.key && !orbitEnabled}
          onSelect={() => onSelectPart(part.key)}
          onDragStart={() => setOrbitEnabled(false)}
          onDragEnd={() => setOrbitEnabled(true)}
          onPositionChange={(pos) => onPartPositionChange(part.key, pos)}
          onRotationChange={(rot) => onPartRotationChange(part.key, rot)}
        />
      ))}

      {/* Invisible plane: click empty space to deselect */}
      <mesh
        position={[L / 2, -0.5, W / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerDown={() => onSelectPart(null)}
      >
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────

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
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const handleOrbitEnabled = useCallback(
    (v: boolean) => setOrbitEnabled(v),
    [],
  );

  const L = bounds.lengthCm / 100;
  const W = bounds.widthCm / 100;
  const H = bounds.heightCm / 100;

  // Camera starts diagonally above and to the side of the truck
  const camPos = useRef<[number, number, number]>([L * 1.6, H * 1.5, W * 2.2]);
  camPos.current = [L * 1.6, H * 1.5, W * 2.2];

  return (
    <Canvas
      style={{ background: "#07101a", width: "100%", height: "100%" }}
      shadows
      camera={{
        position: camPos.current,
        fov: 45,
        near: 0.05,
        far: 500,
      }}
      gl={{ antialias: true, alpha: false }}
    >
      <SceneInner
        bounds={bounds}
        parts={parts}
        selectedKey={selectedKey}
        onSelectPart={onSelectPart}
        onPartPositionChange={onPartPositionChange}
        onPartRotationChange={onPartRotationChange}
        orbitEnabled={orbitEnabled}
        setOrbitEnabled={handleOrbitEnabled}
      />
    </Canvas>
  );
}
