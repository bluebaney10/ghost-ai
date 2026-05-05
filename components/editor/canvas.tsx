"use client";

import { useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  type ReactFlowInstance,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

import { canvasNode, type CanvasNode, type CanvasEdge, type DragPayload } from "@/types/canvas";
import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";

const DEFAULT_NODE_COLOR = "#64748b";

const nodeTypes = {
  [canvasNode]: CanvasNodeComponent,
};

let nodeCounter = 0;

export function Canvas() {
  const rfRef = useRef<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const raw = event.dataTransfer.getData("application/ghost-ai-shape");
    if (!raw || !rfRef.current) return;

    const payload: DragPayload = JSON.parse(raw);
    // Convert screen coords to flow coords first, then apply the centering
    // offset in flow-space so it's correct at any zoom level.
    const flowPoint = rfRef.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const position = {
      x: flowPoint.x - payload.width / 2,
      y: flowPoint.y - payload.height / 2,
    };

    const id = `${payload.shape}-${Date.now()}-${nodeCounter++}`;
    const newNode: CanvasNode = {
      id,
      type: canvasNode,
      position,
      data: {
        label: "",
        color: DEFAULT_NODE_COLOR,
        shape: payload.shape,
      },
      width: payload.width,
      height: payload.height,
    };

    onNodesChange([{ type: "add", item: newNode }]);
  }

  return (
    <div
      className="relative h-full w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onInit={(instance) => { rfRef.current = instance; }}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ background: 'var(--background)' }}
      >
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.08)" gap={24} size={1.5} />
        <Cursors />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}
