// src/engine/objects/Arrow.ts
import { BaseObject } from "./BaseObject";

export class Arrow extends BaseObject {
  x2: number;
  y2: number;

  constructor(id: string, x1: number, y1: number, x2: number, y2: number) {
    super(id, x1, y1, 0);
    this.x2 = x2;
    this.y2 = y2;
    this.draggable = true
  }

  undoable = true;


  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    // arrow head
    const angle = Math.atan2(this.y2 - this.y, this.x2 - this.x);
    const headLen = 10;

    ctx.beginPath();
    ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - headLen * Math.cos(angle - Math.PI / 6),
      this.y2 - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      this.x2 - headLen * Math.cos(angle + Math.PI / 6),
      this.y2 - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = "#ffcc00";
    ctx.fill();
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
    const buffer = 5; // how close the cursor can be to the line
    const dx = this.x2 - this.x;
    const dy = this.y2 - this.y;
    const length = Math.sqrt(dx*dx + dy*dy);
    const distance = Math.abs(dy*x - dx*y + this.x2*this.y - this.y2*this.x) / length;
    return distance <= buffer;
  }

  clone(): Arrow {
    const copy = new Arrow(this.id, this.x, this.y, this.x2, this.y2);
    copy.isSelected = this.isSelected;
    copy.isHovered = this.isHovered;
    copy.draggable = this.draggable;
    return copy;
  }
}
