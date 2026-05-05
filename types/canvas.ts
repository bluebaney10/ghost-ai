import type { Node, Edge } from "@xyflow/react";

export type NodeData = {
  label: string;
  color: string;
  shape: "rectangle" | "circle" | "diamond";
};

export type CanvasNode = Node<NodeData>;
export type CanvasEdge = Edge;

export const canvasNode = "canvasNode" as const;
export const canvasEdge = "canvasEdge" as const;
