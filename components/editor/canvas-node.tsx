"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";
import type { CanvasNode } from "@/types/canvas";

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  return (
    <div
      style={{ borderColor: data.color }}
      className={cn(
        "flex min-h-[40px] min-w-[60px] items-center justify-center rounded border-2 bg-card px-3 py-2 text-sm text-foreground",
        selected && "ring-2 ring-primary ring-offset-background ring-offset-1"
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Left} />
      <span className="text-center">{data.label}</span>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
