// src/engine/tools/ArrowTool.ts
import { Arrow } from "../objects/Arrow";
import { CanvasRenderer } from "../renderer/CanvasRenderer";
import type { Tool } from "./Tool";

export class ArrowTool implements Tool {
  private startX = 0;
  private startY = 0;
  private currentArrow: Arrow | null = null;

  constructor(private renderer: CanvasRenderer) {}

  onMouseDown(x: number, y: number) {
    this.renderer.saveState()
    this.startX = x;
    this.startY = y;
    this.currentArrow = new Arrow(
      crypto.randomUUID(),
      x,
      y,
      x,
      y
    );
    this.renderer.addObject(this.currentArrow);
  }

  onMouseMove(x: number, y: number) {
    if (!this.currentArrow) return;
    this.currentArrow.x2 = x;
    this.currentArrow.y2 = y;
    this.renderer.render();
  }

  onMouseUp() {
    this.currentArrow = null;
  }
}
