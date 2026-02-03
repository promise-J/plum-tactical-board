import { BaseObject } from "./BaseObject";

const HANDLE_SIZE = 8;
export type ResizeHandle = "nw" | "ne" | "sw" | "se" | null;

export class Rectangle extends BaseObject {
  undoable = true;
  selectable = true;
  strokeColor: string;
  strokeWidth: number;

  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    strokeColor: string = "#ff0000",
    strokeWidth: number = 4
  ) {
    super(id, x, y);
    this.strokeColor = strokeColor
    this.strokeWidth = strokeWidth
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeColor;
    // ctx.strokeStyle = "rgba(0,0,255,0.8)";
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    if (this.isSelected) {
      this.drawHandles(ctx);
    }
  }

  isHit(px: number, py: number) {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  setFromPoints(x1: number, y1: number, x2: number, y2: number) {
    this.x = Math.min(x1, x2);
    this.y = Math.min(y1, y2);
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
  }

  private isNear(
    mx: number,
    my: number,
    x: number,
    y: number,
    size = 6
  ): boolean {
    return (
      mx >= x - size &&
      mx <= x + size &&
      my >= y - size &&
      my <= y + size
    );
  }


  /* ---------------- RESIZE HANDLES ---------------- */

  private drawHandles(ctx: CanvasRenderingContext2D) {
    const handles = this.getHandlePositions();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = this.strokeColor;
  
    handles.forEach((h) => {
      ctx.fillRect(h.x, h.y, HANDLE_SIZE, HANDLE_SIZE);
      ctx.strokeRect(h.x, h.y, HANDLE_SIZE, HANDLE_SIZE);
    });
  }

  //   getResizeHandle(px: number, py: number) {
  //     return this.getHandlePositions().find(h =>
  //       px >= h.x &&
  //       px <= h.x + HANDLE_SIZE &&
  //       py >= h.y &&
  //       py <= h.y + HANDLE_SIZE
  //     )?.type ?? null;
  //   }

  getResizeHandle(x: number, y: number): ResizeHandle {
    const size = 6;

    if (this.isNear(x, y, this.x, this.y)) return "nw";
    if (this.isNear(x, y, this.x + this.width, this.y)) return "ne";
    if (this.isNear(x, y, this.x, this.y + this.height)) return "sw";
    if (this.isNear(x, y, this.x + this.width, this.y + this.height))
      return "se";

    return null;
  }

  resizeFromHandle(handle: "nw" | "ne" | "sw" | "se", mx: number, my: number) {
    switch (handle) {
      case "nw":
        this.width += this.x - mx;
        this.height += this.y - my;
        this.x = mx;
        this.y = my;
        break;

      case "ne":
        this.width = mx - this.x;
        this.height += this.y - my;
        this.y = my;
        break;

      case "sw":
        this.width += this.x - mx;
        this.x = mx;
        this.height = my - this.y;
        break;

      case "se":
        this.width = mx - this.x;
        this.height = my - this.y;
        break;
    }
  }

  private getHandlePositions() {
    return [
      { type: "nw", x: this.x - HANDLE_SIZE / 2, y: this.y - HANDLE_SIZE / 2 },
      {
        type: "ne",
        x: this.x + this.width - HANDLE_SIZE / 2,
        y: this.y - HANDLE_SIZE / 2,
      },
      {
        type: "sw",
        x: this.x - HANDLE_SIZE / 2,
        y: this.y + this.height - HANDLE_SIZE / 2,
      },
      {
        type: "se",
        x: this.x + this.width - HANDLE_SIZE / 2,
        y: this.y + this.height - HANDLE_SIZE / 2,
      },
    ];
  }

  clone() {
    return new Rectangle(
      this.id,
      this.x,
      this.y,
      this.width,
      this.height,
      this.strokeColor,
      this.strokeWidth
    );
  }
}
