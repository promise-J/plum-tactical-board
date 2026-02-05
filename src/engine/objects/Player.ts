// src/engine/objects/Player.ts
import { BaseObject } from "./BaseObject";

export class Player extends BaseObject {
  number: number;
  color: string;
  radius = 16;
  role?: string;
  name?: string;

  constructor(
    id: string,
    x: number,
    y: number,
    number: number,
    color = "#ff3b3b",
    name: string
  ) {
    super(id, x, y, 0);
    this.number = number;
    this.color = color;
    this.name = name;
    this.draggable = true;
    this.selectable = true;
    this.undoable = false;
    this.radius = 16;
  }

  drawSelection(ctx: CanvasRenderingContext2D) {
    if (!this.isSelected) return;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  
  //   // circle
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  //   ctx.fillStyle = this.color;
  //   ctx.fill();
  //   // ctx.closePath();

  //   if (this.selected) {
  //     ctx.strokeStyle = "#ffd166";
  //     ctx.lineWidth = 3;
  //     ctx.beginPath();
  //     ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
  //     ctx.stroke();
  //   }

  //   // number
  //   // ctx.fillStyle = "#fff";
  //   // ctx.font = "bold 12px Arial";
  //   // ctx.textAlign = "center";
  //   // ctx.textBaseline = "middle";
  //   // ctx.fillText(this.number.toString(), this.x, this.y);
  // }

  // draw(ctx: CanvasRenderingContext2D) {
  //   const RADIUS = 16;

  //   // Player circle
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, RADIUS, 0, Math.PI * 2);
  //   ctx.fillStyle = this.color || "#ff3b3b";
  //   ctx.fill();
  //   ctx.closePath();

  //   // Outline
  //   ctx.strokeStyle = "#ffffff";
  //   ctx.lineWidth = 2;
  //   ctx.stroke();

  //   // Player number
  //   ctx.fillStyle = "#ffffff";
  //   // ctx.font = `${this.radius}px bold Arial`;
  //   ctx.font = "bold 14px sans-serif";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";
  //   ctx.fillText(String(this.number), this.x, this.y);

  //   // Position (below)
  //   ctx.fillStyle = "#00ffff";
  //   // ctx.font = "bold 11px Arial";
  //   ctx.font = "bold 12px sans-serif";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "top";
  //   const displayText = (this.name || `Player ${this.number}`).trim(); // <-- UPDATED: Trim to avoid hidden spaces
  //   const textY = this.y + this.radius + 8; // <-- UPDATED: Slightly lower position
  //   ctx.fillText(displayText, this.x, textY);
  //   ctx.restore();
  //   ctx.fillText(this.name || "", this.x, this.y + this.radius + 6);
  draw(ctx: CanvasRenderingContext2D) {
    const RADIUS = 16;
  
    // Player circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.color || "#ff3b3b";
    ctx.fill();
    ctx.closePath();
  
    // Outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // Player number
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.number), this.x, this.y);
  
    // Position (below) - FIXED: Single, properly wrapped text drawing
    ctx.save();  // <-- Ensure context is saved
    ctx.fillStyle = "#000000";  // <-- CHANGED: Black for visibility (not cyan)
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const displayText = (this.name || `Player ${this.number}`).trim();
    const textY = this.y + this.radius + 8;
    ctx.fillText(displayText, this.x, textY);
    ctx.restore();  // <-- Properly restore context
  }

  isHit(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= 16;
  }

  clone() {
    const p = new Player(
      this.id,
      this.x,
      this.y,
      this.number,
      this.color,
      this.name || ""
    );
    p.isSelected = this.isSelected;
    return p;
  }
}
