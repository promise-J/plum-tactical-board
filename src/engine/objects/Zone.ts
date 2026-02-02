// src/engine/objects/Zone.ts
import { BaseObject } from "./BaseObject";

export class Zone extends BaseObject {
  width: number;
  height: number;

  constructor(id: string, x: number, y: number, w: number, h: number) {
    super(id, x, y, 0);
    this.width = w;
    this.height = h;
  }

  undoable = true;


  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0, 153, 255, 0.25)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  drawSelection(ctx: CanvasRenderingContext2D) {
    if (!this.isSelected) return;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  isHit(x: number, y: number): boolean {
    return x >= this.x &&
           x <= this.x + this.width &&
           y >= this.y &&
           y <= this.y + this.height;
  }

  clone(): Zone {
    const copy = new Zone(this.id, this.x, this.y, this.width, this.height);
    copy.isSelected = this.isSelected;
    copy.isHovered = this.isHovered;
    copy.draggable = this.draggable;
    return copy;
  }
  
}
