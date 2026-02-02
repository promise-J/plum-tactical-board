// src/engine/tools/Tool.ts
export interface Tool {
    onMouseDown(x: number, y: number): void;
    onMouseMove(x: number, y: number): void;
    onMouseUp(x: number, y: number): void;
  }
  