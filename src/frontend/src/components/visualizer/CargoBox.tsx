/**
 * CargoBox.tsx
 * A single draggable, rotatable furniture part in the R3F scene.
 * Units: meters (cm / 100). Position = center of box.
 * Drag: XZ plane at y = part's current Y (floor contact).
 * R key: cycles orientations when selected.
 */

import type { ScenePart, TruckBounds } from "@/types/visualizer";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Bottom-side rotation presets (euler radians)
export const BOTTOM_SIDE_ROTATIONS: Record<string, [number, number, number]> = {
  Bottom: [0, 0, 0],
  Top: [Math.PI, 0, 0],
  Front: [-Math.PI / 2, 0, 0],
  Back: [Math.PI / 2, 0, 0],
  Left: [0, 0, Math.PI / 2],
  Right: [0, 0, -Math.PI / 2],
};

const ROTATION_CYCLE: [number, number, number][] = [
  [0, 0, 0],
  [Math.PI, 0, 0],
  [-Math.PI / 2, 0, 0],
  [Math.PI / 2, 0, 0],
  [0, 0, Math.PI / 2],
  [0, 0, -Math.PI / 2],
];

interface CargoBoxProps {
  part: ScenePart;
  truckBounds: TruckBounds;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: [number, number, number]) => void;
}

export function CargoBox({
  part,
  truckBounds,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onPositionChange,
  onRotationChange,
}: CargoBoxProps) {
  const { camera, gl, raycaster, pointer } = useThree();

  // Convert cm to meters: W=length(X), H=height(Y), D=width(Z)
  const W = part.lengthCm / 100;
  const H = part.heightCm / 100;
  const D = part.widthCm / 100;

  const meshRef = useRef<THREE.Mesh>(null);
  const dragging = useRef(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const intersectTarget = useRef(new THREE.Vector3());

  // Refs to capture latest prop values without re-creating handlers
  const partRef = useRef(part);
  partRef.current = part;
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  const truckBoundsRef = useRef(truckBounds);
  truckBoundsRef.current = truckBounds;

  // Out of bounds check (positions in meters, bounds in cm/100)
  const isOutOfBounds = useMemo(() => {
    const [px, py, pz] = part.position;
    const bL = truckBounds.lengthCm / 100;
    const bW = truckBounds.widthCm / 100;
    const bH = truckBounds.heightCm / 100;
    return (
      px - W / 2 < 0 ||
      px + W / 2 > bL ||
      py - H / 2 < 0 ||
      py + H / 2 > bH ||
      pz - D / 2 < 0 ||
      pz + D / 2 > bW
    );
  }, [part.position, W, H, D, truckBounds]);

  // Material colors
  const baseColor = useMemo(() => new THREE.Color(part.color), [part.color]);
  const emissiveColor = useMemo(() => {
    if (isOutOfBounds) return new THREE.Color(0xff2222);
    if (isSelected) return new THREE.Color(0x004466);
    return new THREE.Color(0x000000);
  }, [isOutOfBounds, isSelected]);

  // Update material each frame for smooth color response
  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.lerp(baseColor, 0.2);
    mat.emissive.lerp(emissiveColor, 0.3);
    mat.emissiveIntensity = isOutOfBounds ? 0.7 : isSelected ? 0.2 : 0;
  });

  // Pointer down: start drag
  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    dragging.current = true;
    onDragStart();
    onSelect();
    gl.domElement.style.cursor = "grabbing";

    // Drag plane at the box's current Y position
    dragPlane.current.constant = -partRef.current.position[1];
    dragOffset.current.set(
      e.point.x - partRef.current.position[0],
      0,
      e.point.z - partRef.current.position[2],
    );
  }

  // Use useFrame to handle drag movement (avoids stale closures via refs)
  useFrame(() => {
    if (!dragging.current || !isDraggingRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.ray.intersectPlane(
      dragPlane.current,
      intersectTarget.current,
    );
    if (!hit) return;

    const bounds = truckBoundsRef.current;
    const bL = bounds.lengthCm / 100;
    const bW = bounds.widthCm / 100;

    const curW = partRef.current.lengthCm / 100;
    const curD = partRef.current.widthCm / 100;

    const newX = Math.max(
      curW / 2,
      Math.min(bL - curW / 2, hit.x - dragOffset.current.x),
    );
    const newZ = Math.max(
      curD / 2,
      Math.min(bW - curD / 2, hit.z - dragOffset.current.z),
    );
    const newY = partRef.current.position[1]; // keep Y stable during XZ drag

    onPositionChange([newX, newY, newZ]);
  });

  // Pointer up: end drag
  useEffect(() => {
    function handleUp() {
      if (dragging.current) {
        dragging.current = false;
        onDragEnd();
        gl.domElement.style.cursor = "default";
      }
    }
    gl.domElement.addEventListener("pointerup", handleUp);
    return () => gl.domElement.removeEventListener("pointerup", handleUp);
  }, [gl, onDragEnd]);

  // R key: cycle rotation when selected
  useEffect(() => {
    if (!isSelected) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "r" && e.key !== "R") return;
      const cur = partRef.current.rotation;
      const current = ROTATION_CYCLE.findIndex(
        (o) =>
          Math.abs(o[0] - cur[0]) < 0.01 &&
          Math.abs(o[1] - cur[1]) < 0.01 &&
          Math.abs(o[2] - cur[2]) < 0.01,
      );
      const next = ROTATION_CYCLE[(current + 1) % ROTATION_CYCLE.length];
      onRotationChange(next);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSelected, onRotationChange]);

  return (
    <group position={part.position} rotation={part.rotation}>
      {/* Main cargo mesh */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={isOutOfBounds ? 0.7 : isSelected ? 0.2 : 0}
          roughness={0.55}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry
            args={[new THREE.BoxGeometry(W + 0.015, H + 0.015, D + 0.015)]}
          />
          <lineBasicMaterial color={0x22d3ee} linewidth={2} />
        </lineSegments>
      )}

      {/* Bottom face indicator strip */}
      <mesh position={[0, -H / 2 + 0.005, 0]}>
        <boxGeometry args={[W * 0.9, 0.01, D * 0.9]} />
        <meshStandardMaterial
          color={0x22d3ee}
          emissive={new THREE.Color(0x22d3ee)}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
