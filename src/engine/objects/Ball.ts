// src/engine/objects/Ball.ts
import { BaseObject } from "./BaseObject";

export class Ball extends BaseObject {
  constructor(id: string, x: number, y: number) {
    super(id, x, y, 8);
    this.draggable = true;
    this.selectable = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x - this.radius * 0.3, 
      this.y - this.radius * 0.3, 
      this.radius * 0.1, 
      this.x, 
      this.y, 
      this.radius
    );
  
    // Classic white ball shading
    gradient.addColorStop(0, "#FFFFFF"); // highlight
    gradient.addColorStop(0.7, "#E0E0E0"); // soft gray middle
    gradient.addColorStop(1, "#C0C0C0"); // darker edge
  
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "#888"; // subtle outline
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
  

  // draw(ctx: CanvasRenderingContext2D) {
  //   const gradient = ctx.createRadialGradient(
  //     this.x,
  //     this.y,
  //     this.radius * 0.2,
  //     this.x,
  //     this.y,
  //     this.radius
  //   );
  //   gradient.addColorStop(0, "#FFFFFF"); // center (bright yellow)
  //   gradient.addColorStop(0.5, "#000000"); // middle (orange)
  //   gradient.addColorStop(1, "#FFFFFF"); // edge (red)
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  //   ctx.fillStyle = gradient;
  //   ctx.fill();
  //   ctx.closePath();
  // }

  isHit(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }

  drawSelection(ctx: CanvasRenderingContext2D) {
    if (!this.isSelected) return;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  clone() {
    const b = new Ball(this.id, this.x, this.y);
    b.isSelected = this.isSelected;
    return b;
  }
}
