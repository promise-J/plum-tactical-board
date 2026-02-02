import type { Tool } from "./Tool";
import { CanvasRenderer } from "../renderer/CanvasRenderer";
import { BaseObject } from "../objects/BaseObject";

export class DragTool implements Tool {
  private target: BaseObject | null = null;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private renderer: CanvasRenderer) {}

  onMouseDown(x: number, y: number) {
    this.renderer.saveState()
    const obj = this.renderer.getObjectAt(x, y);
    if (!obj) return;

    this.target = obj;
    this.offsetX = x - obj.x;
    this.offsetY = y - obj.y;
  }

  onMouseMove(x: number, y: number) {
    if (!this.target) return;

    this.target.x = x - this.offsetX;
    this.target.y = y - this.offsetY;

    this.renderer.render();
  }

  onMouseUp() {
    this.target = null;
  }
}
