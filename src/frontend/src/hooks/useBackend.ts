/**
 * useBackend.ts
 * React Query hooks wired to the real backend actor via useActor.
 * All IDs are bigint; all enums come from @/backend.
 */

import {
  ApprovalStatus,
  BottomSide,
  OrderStatus,
  createActor,
} from "@/backend";
import type {
  Order,
  OrderId,
  OrderItem,
  Part,
  PartId,
  PartPlacement,
  Product,
  ProductId,
  TruckDimensions,
  TruckLoad,
  TruckLoadId,
  UserApprovalInfo,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// TruckLoadStatus is structurally identical to OrderStatus (Shipped | Pending)
export const TruckLoadStatus = OrderStatus;
export type TruckLoadStatus = OrderStatus;

// ─── Actor helper ─────────────────────────────────────────────────────────────

function useBackendActor() {
  return useActor(createActor);
}

// ─── Approval Hooks ───────────────────────────────────────────────────────────

export function useApprovals() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserApprovalInfo[]>({
    queryKey: ["approvals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      approved,
    }: {
      principal: string;
      approved: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal } = await import("@icp-sdk/core/principal");
      const p = Principal.fromText(principal);
      const status = approved
        ? ApprovalStatus.approved
        : ApprovalStatus.rejected;
      return actor.setApproval(p, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["approvals"] }),
  });
}

export function useRequestApproval() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.requestApproval();
    },
  });
}

export function useBootstrapAdmin() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.bootstrapAdmin();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
      qc.invalidateQueries({ queryKey: ["isApproved"] });
    },
  });
}

export function useIsApproved() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isApproved"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Product Hooks ────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createProduct(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      active,
      parts,
    }: {
      id: ProductId;
      name: string;
      active: boolean;
      parts: Part[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProduct(id, name, active, parts);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deactivateProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useAddPart() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      name,
      lengthCm,
      widthCm,
      heightCm,
      weightKg,
      bottomSide,
    }: {
      productId: ProductId;
      name: string;
      lengthCm: bigint;
      widthCm: bigint;
      heightCm: bigint;
      weightKg: number;
      bottomSide: BottomSide;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addPart(
        productId,
        name,
        lengthCm,
        widthCm,
        heightCm,
        weightKg,
        bottomSide,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdatePart() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      partId,
      name,
      lengthCm,
      widthCm,
      heightCm,
      weightKg,
      bottomSide,
    }: {
      productId: ProductId;
      partId: PartId;
      name: string;
      lengthCm: bigint;
      widthCm: bigint;
      heightCm: bigint;
      weightKg: number;
      bottomSide: BottomSide;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePart(
        productId,
        partId,
        name,
        lengthCm,
        widthCm,
        heightCm,
        weightKg,
        bottomSide,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeletePart() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      partId,
    }: {
      productId: ProductId;
      partId: PartId;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removePart(productId, partId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// ─── Order Hooks ──────────────────────────────────────────────────────────────

export function useOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders(null, false);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clientName,
      clientStore,
      items,
      deadline,
      emergency,
    }: {
      clientName: string;
      clientStore: string;
      items: OrderItem[];
      deadline: bigint;
      emergency: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrder(
        clientName,
        clientStore,
        items,
        deadline,
        emergency,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      clientName,
      clientStore,
      items,
      deadline,
      emergency,
    }: {
      id: OrderId;
      clientName: string;
      clientStore: string;
      items: OrderItem[];
      deadline: bigint;
      emergency: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrder(
        id,
        clientName,
        clientStore,
        items,
        deadline,
        emergency,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: OrderId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteOrder(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: OrderId;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// ─── Truck Load Hooks ─────────────────────────────────────────────────────────

export function useTruckLoads() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TruckLoad[]>({
    queryKey: ["truckLoads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTruckLoads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTruckLoad(id: TruckLoadId | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TruckLoad | null>({
    queryKey: ["truckLoads", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getTruckLoad(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateTruckLoad() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      truckDimensions,
      orderIds,
    }: {
      truckDimensions: TruckDimensions;
      orderIds: OrderId[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createTruckLoad(truckDimensions, orderIds);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["truckLoads"] }),
  });
}

export function useUpdateTruckLoadStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: TruckLoadId;
      status: TruckLoadStatus;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setTruckLoadStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["truckLoads"] }),
  });
}

export function useUpdateTruckLoadPlacements() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      placements,
    }: {
      id: TruckLoadId;
      placements: PartPlacement[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveLoadingScheme(id, placements);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["truckLoads"] }),
  });
}

export function useOptimizeTruckLoad() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: TruckLoadId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.optimizeTruckLoad(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["truckLoads"] }),
  });
}

// ─── Convenience re-exports ────────────────────────────────────────────────────
export { ApprovalStatus, BottomSide, OrderStatus };
