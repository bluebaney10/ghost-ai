import type { Node, Edge } from "@xyflow/react";

export type NodeData = {
  label: string;
  color: string;
  shape: "rectangle" | "circle" | "diamond" | "pill" | "cylinder" | "hexagon";
};

export type DragPayload = {
  shape: NodeData["shape"];
  width: number;
  height: number;
};

export type CanvasNode = Node<NodeData>;
export type CanvasEdge = Edge;

export const canvasNode = "canvasNode" as const;
export const canvasEdge = "canvasEdge" as const;
