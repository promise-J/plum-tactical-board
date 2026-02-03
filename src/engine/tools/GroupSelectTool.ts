// src/engine/tools/GroupSelectTool.ts
import { type Tool } from "./Tool";
import { CanvasRenderer } from "../renderer/CanvasRenderer";
import { BaseObject } from "../objects/BaseObject";

export class GroupSelectTool implements Tool {
    private startX = 0;
    private startY = 0;
    private endX = 0;
    private endY = 0;
    private isSelecting = false;
    private isDraggingGroup = false;
  
    private selectedObjects: BaseObject[] = [];
    private dragOffset: { x: number; y: number }[] = [];
  
    constructor(private renderer: CanvasRenderer) {}
  
    onMouseDown(x: number, y: number) {
      // Check if clicking on already-selected object
      const hit = this.renderer
        .getObjects()
        .find(o => o.isSelected && o.isHit(x, y));
  
      if (hit && this.selectedObjects.length > 0) {
        // ✅ SAVE STATE ONCE
        this.renderer.saveState();
  
        this.isDraggingGroup = true;
        this.dragOffset = this.selectedObjects.map(o => ({
          x: x - o.x,
          y: y - o.y,
        }));
        return;
      }
  
      // Start selection rectangle
      this.renderer.clearTheSelection();
      this.selectedObjects = [];
  
      this.startX = x;
      this.startY = y;
      this.endX = x;
      this.endY = y;
      this.isSelecting = true;
    }
  
    onMouseMove(x: number, y: number) {
      if (this.isDraggingGroup) {
        this.selectedObjects.forEach((obj, i) => {
          obj.x = x - this.dragOffset[i].x;
          obj.y = y - this.dragOffset[i].y;
        });
        this.renderer.render();
        return;
      }
  
      if (!this.isSelecting) return;
  
      this.endX = x;
      this.endY = y;
  
      this.renderer.render();
      const ctx = this.renderer.getCtx();
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(0,255,0,0.8)";
      ctx.strokeRect(
        Math.min(this.startX, this.endX),
        Math.min(this.startY, this.endY),
        Math.abs(this.endX - this.startX),
        Math.abs(this.endY - this.startY)
      );
      ctx.restore();
    }
  
    onMouseUp() {
      if (this.isDraggingGroup) {
        this.isDraggingGroup = false;
        return;
      }
  
      if (!this.isSelecting) return;
  
      const x1 = Math.min(this.startX, this.endX);
      const y1 = Math.min(this.startY, this.endY);
      const x2 = Math.max(this.startX, this.endX);
      const y2 = Math.max(this.startY, this.endY);
  
      this.selectedObjects = this.renderer
        .getObjects()
        .filter(o => o.selectable && o.x >= x1 && o.x <= x2 && o.y >= y1 && o.y <= y2);
  
      this.selectedObjects.forEach(o => (o.isSelected = true));
  
      this.isSelecting = false;
      this.renderer.render();
    }
  }
  
