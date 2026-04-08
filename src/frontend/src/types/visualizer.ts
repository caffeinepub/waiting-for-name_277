/**
 * visualizer.ts — types used exclusively by the 3D visualizer
 */

import type { BottomSide } from "@/backend";
export type { BottomSide };

/** A part instance in the scene, combining product/part info with placement state */
export interface ScenePart {
  /** Unique key: `${orderId}__${productId}__${partId}__${qIdx}__${pIdx}` */
  key: string;
  orderId: bigint;
  productId: bigint;
  partId: bigint;
  /** Human-readable label: "ProductName — PartName" */
  label: string;
  /** Dimensions in cm */
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  /** Current world-space position [x, y, z] in cm */
  position: [number, number, number];
  /** Euler rotation in radians [rx, ry, rz] */
  rotation: [number, number, number];
  /** Which face is touching the floor */
  bottomSide: BottomSide;
  /** Colour hex for this product (assigned by index) */
  color: string;
}

/** Truck cargo bounds in cm */
export interface TruckBounds {
  lengthCm: number; // X axis
  widthCm: number; // Z axis
  heightCm: number; // Y axis
}
