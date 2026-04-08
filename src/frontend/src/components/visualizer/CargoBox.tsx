/**
 * CargoBox.tsx
 * A single draggable, rotatable furniture part in the R3F scene.
 */

import type { ScenePart, TruckBounds } from "@/types/visualizer";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const BOTTOM_ORIENTATIONS: [number, number, number][] = [
  [0, 0, 0], // Bottom down (default)
  [Math.PI, 0, 0], // Top down
  [-Math.PI / 2, 0, 0], // Front down
  [Math.PI / 2, 0, 0], // Back down
  [0, 0, Math.PI / 2], // Left down
  [0, 0, -Math.PI / 2], // Right down
];

interface CargoBoxProps {
  part: ScenePart;
  truckBounds: TruckBounds;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: [number, number, number]) => void;
}

export function CargoBox({
  part,
  truckBounds,
  isSelected,
  onSelect,
  onPositionChange,
  onRotationChange,
}: CargoBoxProps) {
  const { camera, gl } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  // 1 unit = 1cm
  const W = part.lengthCm;
  const H = part.heightCm;
  const D = part.widthCm;

  const isOutOfBounds = useMemo(() => {
    const [px, py, pz] = part.position;
    const hw = W / 2;
    const hh = H / 2;
    const hd = D / 2;
    return (
      px - hw < 0 ||
      px + hw > truckBounds.lengthCm ||
      py - hh < 0 ||
      py + hh > truckBounds.heightCm ||
      pz - hd < 0 ||
      pz + hd > truckBounds.widthCm
    );
  }, [part.position, W, H, D, truckBounds]);

  const baseColor = useMemo(() => new THREE.Color(part.color), [part.color]);
  const emissiveColor = useMemo(
    () =>
      isOutOfBounds
        ? new THREE.Color(0xff1111)
        : isSelected
          ? new THREE.Color(0x004466)
          : new THREE.Color(0x000000),
    [isOutOfBounds, isSelected],
  );

  function handlePointerDown(
    e: THREE.Event & { stopPropagation?: () => void; point?: THREE.Vector3 },
  ) {
    if (e.stopPropagation) e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = "grabbing";
    dragPlane.current.constant = -part.position[1];
    if (e.point) {
      dragOffset.current.set(
        e.point.x - part.position[0],
        0,
        e.point.z - part.position[2],
      );
    }
    onSelect();
  }

  function handlePointerUp() {
    setIsDragging(false);
    gl.domElement.style.cursor = "grab";
  }

  function handlePointerMissed() {
    setIsDragging(false);
  }

  useEffect(() => {
    if (!isDragging) return;
    const canvas = gl.domElement;

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.current.setFromCamera(pointer.current, camera);
      const target = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(dragPlane.current, target);
      if (!target) return;

      const newX = Math.max(
        W / 2,
        Math.min(truckBounds.lengthCm - W / 2, target.x - dragOffset.current.x),
      );
      const newZ = Math.max(
        D / 2,
        Math.min(truckBounds.widthCm - D / 2, target.z - dragOffset.current.z),
      );

      onPositionChange([newX, part.position[1], newZ]);
    }

    function onMouseUp() {
      setIsDragging(false);
      canvas.style.cursor = "default";
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDragging,
    camera,
    gl,
    W,
    D,
    truckBounds,
    part.position,
    onPositionChange,
  ]);

  // R key rotation
  useEffect(() => {
    if (!isSelected) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "r" && e.key !== "R") return;
      const current = BOTTOM_ORIENTATIONS.findIndex(
        (o) =>
          Math.abs(o[0] - part.rotation[0]) < 0.01 &&
          Math.abs(o[1] - part.rotation[1]) < 0.01 &&
          Math.abs(o[2] - part.rotation[2]) < 0.01,
      );
      const next =
        BOTTOM_ORIENTATIONS[(current + 1) % BOTTOM_ORIENTATIONS.length];
      onRotationChange(next);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSelected, part.rotation, onRotationChange]);

  return (
    <group position={part.position} rotation={part.rotation}>
      <mesh
        position={[0, 0, 0]}
        onPointerDown={
          handlePointerDown as unknown as (
            e: React.PointerEvent<THREE.Object3D>,
          ) => void
        }
        onPointerUp={handlePointerUp}
        onPointerMissed={handlePointerMissed}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={isOutOfBounds ? 0.8 : isSelected ? 0.15 : 0}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(W + 1, H + 1, D + 1)]} />
          <lineBasicMaterial color={0x22d3ee} linewidth={2} />
        </lineSegments>
      )}

      {/* Bottom face highlight */}
      <mesh position={[0, -H / 2 + 0.5, 0]}>
        <boxGeometry args={[W - 2, 1, D - 2]} />
        <meshStandardMaterial
          color={0x22d3ee}
          emissive={new THREE.Color(0x22d3ee)}
          emissiveIntensity={0.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
