export abstract class BaseObject {
  id: string;
  x: number;
  y: number;

  radius: number;

  selectable = true;
  draggable = true;
  undoable = true;

  isSelected = false;
  isHovered = false;

  rotation = 0;

  constructor(
    id: string,
    x: number,
    y: number,
    radius = 16,
    rotation = 0
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotation = rotation;
  }

  /** Draw the object itself */
  abstract draw(ctx: CanvasRenderingContext2D): void;

  /** Clone for undo / copy */
  abstract clone(): BaseObject;

  /** Hit test */
  isHit(mx: number, my: number): boolean {
    const dx = mx - this.x;
    const dy = my - this.y;
    return Math.hypot(dx, dy) <= this.radius;
  }

  /** Selection / hover ring */
  drawSelection(ctx: CanvasRenderingContext2D) {
    if (!this.isSelected && !this.isHovered) return;

    ctx.save();

    ctx.strokeStyle = this.isSelected ? "green" : "yellow";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.radius + 3,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.restore();
  }
}
