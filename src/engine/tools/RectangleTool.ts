// src/engine/tools/RectangleTool.ts
import { Rectangle } from "../objects/Rectangle";
import { CanvasRenderer } from "../renderer/CanvasRenderer";

export class RectangleTool {
  private renderer: CanvasRenderer;
  private startX = 0;
  private startY = 0;
  private currentRect: Rectangle | null = null;

  constructor(renderer: CanvasRenderer, private rectColor: string, private rectThickness: number) {
    this.renderer = renderer;
  }

  onMouseDown(x: number, y: number) {
    this.startX = x;
    this.startY = y;

    this.currentRect = new Rectangle(
      `rect-${Date.now()}`,
      x,
      y,
      0,
      0,
      this.rectColor,
      this.rectThickness
    );

    this.renderer.addObject(this.currentRect);
  }

  onMouseMove(x: number, y: number) {
    if (!this.currentRect) return;

    this.currentRect.width = x - this.startX;
    this.currentRect.height = y - this.startY;

    this.renderer.render();
  }

  onMouseUp() {
    this.currentRect = null;
  }
}
