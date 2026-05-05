"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import { Canvas } from "@/components/editor/canvas";

class LbErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Liveblocks connection error:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface CanvasWrapperProps {
  roomId: string;
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <LbErrorBoundary
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Failed to connect to room
              </p>
            </div>
          }
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading canvas…
                </p>
              </div>
            }
          >
            <Canvas />
          </ClientSideSuspense>
        </LbErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
