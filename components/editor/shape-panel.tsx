"use client";

import { Circle, Database, Diamond, Hexagon, RectangleHorizontal, Square } from "lucide-react";
import type { ReactNode } from "react";

import type { DragPayload, NodeData } from "@/types/canvas";

type ShapeConfig = {
  shape: NodeData["shape"];
  icon: ReactNode;
  width: number;
  height: number;
  label: string;
};

const SHAPES: ShapeConfig[] = [
  { shape: "rectangle", icon: <Square className="h-4 w-4" />, width: 160, height: 80, label: "Rectangle" },
  { shape: "diamond", icon: <Diamond className="h-4 w-4" />, width: 120, height: 120, label: "Diamond" },
  { shape: "circle", icon: <Circle className="h-4 w-4" />, width: 80, height: 80, label: "Circle" },
  { shape: "pill", icon: <RectangleHorizontal className="h-4 w-4" />, width: 160, height: 60, label: "Pill" },
  { shape: "cylinder", icon: <Database className="h-4 w-4" />, width: 80, height: 100, label: "Cylinder" },
  { shape: "hexagon", icon: <Hexagon className="h-4 w-4" />, width: 100, height: 100, label: "Hexagon" },
];

export function ShapePanel() {
  function handleDragStart(event: React.DragEvent<HTMLButtonElement>, payload: DragPayload) {
    event.dataTransfer.setData("application/ghost-ai-shape", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card px-3 py-2 shadow-lg">
      {SHAPES.map(({ shape, icon, width, height, label }) => (
        <button
          key={shape}
          type="button"
          draggable
          onDragStart={(e) => handleDragStart(e, { shape, width, height })}
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing"
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
