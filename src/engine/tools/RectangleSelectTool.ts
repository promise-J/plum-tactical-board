import { type Tool } from "./Tool";
import { Rectangle } from "../objects/Rectangle";
import { CanvasRenderer } from "../renderer/CanvasRenderer";

type ResizeHandle = "nw" | "ne" | "sw" | "se" | null;

export class RectangleSelectTool implements Tool {
  private rect: Rectangle | null = null;
  private startX = 0;
  private startY = 0;
  private activeHandle: ResizeHandle = null;
  private isDragging = false;

  constructor(
    private renderer: CanvasRenderer,
    private rectColor: string,
    private rectThickness: number
  ) {}

  onMouseDown(x: number, y: number) {
    const hit = this.renderer.getObjectAt(x, y);

    // 👉 Check resize handles first
    if (hit instanceof Rectangle) {
      const handle = hit.getResizeHandle(x, y);
      if (handle) {
        this.rect = hit;
        this.activeHandle = handle;
        this.isDragging = true;
        return;
      }
    }

    // 👉 Create new rectangle
    this.renderer.clearTheSelection();

    this.startX = x;
    this.startY = y;
    this.isDragging = true;

    this.rect = new Rectangle(`rect-${Date.now()}`, x, y, 0, 0, this.rectColor, this.rectThickness);
    this.renderer.addObject(this.rect);
  }
  
  onMouseMove(x: number, y: number) {
    if (!this.rect || !this.isDragging) return;

    // 🔹 Resizing
    if (this.activeHandle) {
      this.rect.resizeFromHandle(this.activeHandle, x, y);
    }
    // 🔹 Drawing new rectangle
    else {
      this.rect.setFromPoints(this.startX, this.startY, x, y);
    }

    this.renderer.render();
  }

  onMouseUp() {
    this.isDragging = false;
    this.activeHandle = null;
  }
}
