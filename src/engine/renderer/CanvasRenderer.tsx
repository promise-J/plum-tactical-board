// src/engine/renderer/CanvasRenderer.ts
import { BaseObject } from "../objects/BaseObject";
import { Player } from "../objects/Player";
import type { Tool } from "../tools/Tool";

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private objects: BaseObject[] = [];
  private activeTool: Tool | null = null;
  private selected: BaseObject | null = null;
  private hoveredObject: BaseObject | null = null;
  private undoStack: BaseObject[][] = [];
  private redoStack: BaseObject[][] = [];
  private onPlayerSelect?: (player: Player) => void;
  private onModalCancel?: () => void; 
  private lastClickTime = 0; 
  private lastClickedPlayer: Player | null = null;  

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unsupported");
    this.ctx = context;
    this.bindEvents();
  }

  // Get selected object
  getSelected() {
    return this.selected;
  }

  getCtx(){
    return this.ctx
  }

  private clearSelection() {
    if (this.selected) {
      this.selected.isSelected = false;
      this.selected = null;
    }
  }

  // Select object
  private selectObject(obj: BaseObject | null) {
    this.clearSelection();
    if (obj) {
      obj.isSelected = true;
      this.selected = obj;
    }
  }

  // Convert mouse event to canvas coordinates
  private getPos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // Bind mouse and keyboard events
  private bindEvents() {
    // Mouse down
    this.canvas.addEventListener("mousedown", (e) => {
      const { x, y } = this.getPos(e);
      const now = Date.now();
      const hit = this.getObjectAt(x, y);
      this.selectObject(hit || null);

      if (hit instanceof Player) {
        if (now - this.lastClickTime < 300 && this.lastClickedPlayer === hit) {  // 300ms threshold
          this.onPlayerSelect?.(hit);  // Trigger edit modal
          return;  // Prevent tool action
        }
        this.lastClickTime = now;
        this.lastClickedPlayer = hit;
      }

      this.activeTool?.onMouseDown(x, y);
    });

    // Mouse move
    this.canvas.addEventListener("mousemove", (e) => {
      const { x, y } = this.getPos(e);

      // Hover logic
      const hit = this.getObjectAt(x, y);
      if (hit && hit.draggable) {
        this.hoveredObject = hit;
        hit.isHovered = true
        this.canvas.style.cursor = "pointer";
      } else {
        this.hoveredObject = null;
        this.canvas.style.cursor = "default";
      }

      this.activeTool?.onMouseMove(x, y);
    });

    // Mouse up
    this.canvas.addEventListener("mouseup", (e) => {
      const { x, y } = this.getPos(e);
      this.activeTool?.onMouseUp(x, y);

      // Save state after finishing a drag or draw
      // this.saveState();
    });

    // Keyboard events
    window.addEventListener("keydown", (e) => {
      // Delete selected object
      if (e.key === "Backspace" && this.selected) {
        this.saveState();
        this.objects = this.objects.filter((o) => o !== this.selected);
        this.selected = null;
        this.render();
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        this.undo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  // Set current tool (e.g., ArrowTool)
  setTool(tool: Tool | null) {
    this.activeTool = tool;
  }

  setOnPlayerSelect(callback: (player: Player) => void) {
    this.onPlayerSelect = callback;
  }

  setOnModalCancel(callback: () => void) {
    this.onModalCancel = callback;
  }

  // Find the top-most object at a given position
  getObjectAt(x: number, y: number): BaseObject | null {
    return [...this.objects].reverse().find((o) => o.isHit(x, y)) || null;
  }

  public getObjects() {
    return this.objects;
  }

  public triggerModalCancel() {
    this.onModalCancel?.();
  }

  public clearTheSelection() {
    this.objects.forEach(o => (o.isSelected = false));
    this.selected = null;
    this.render();
  }

  // Add new object
  public addObject(obj: BaseObject) {
    if (this.objects.includes(obj)) return;
    this.saveState(); // 🔥 save previous state for undo
    this.objects.push(obj);
    this.render();
  }

  public clear() {
    this.objects = [];
    this.render(); // optional, to immediately clear canvas
  }
  

  // Render the canvas
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach((o) => {
      o.draw(this.ctx);
      o.drawSelection?.(this.ctx); // optional drawSelection
    });
  }

  // Undo last action
  undo() {
    if (this.undoStack.length === 0) return;
  
    const previousUndoables = this.undoStack.pop()!;
    const currentUndoables = this.objects.filter(o => o.undoable);
  
    this.redoStack.push(currentUndoables.map(o => o.clone()));
  
    // keep non-undoable objects (players, ball)
    const staticObjects = this.objects.filter(o => !o.undoable);
  
    this.objects = [...staticObjects, ...previousUndoables];
    this.render();
  }
  

  // Redo last undone action
  redo() {
    if (this.redoStack.length === 0) return;
  
    const nextUndoables = this.redoStack.pop()!;
    const currentUndoables = this.objects.filter(o => o.undoable);
  
    this.undoStack.push(currentUndoables.map(o => o.clone()));
  
    const staticObjects = this.objects.filter(o => !o.undoable);
  
    this.objects = [...staticObjects, ...nextUndoables];
    this.render();
  }  

  // Resize canvas
  resize(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.render();
  }

  // Save current state for undo

  public saveState() {
    const snapshot = this.objects
      .filter(o => o.undoable)
      .map(o => o.clone());

      const selectedIds = this.objects
      .filter(o => o.isSelected)
      .map(o => o.id);
  
      // this.undoStack.push({ objects: snapshot, selectedIds });
    this.undoStack.push(snapshot);
    this.redoStack = [];
  }

  public getWidth() {
    return this.canvas.width;
  }
  
  public getHeight() {
    return this.canvas.height;
  }

  getPitchBounds() {
    return {
      x: this.canvas.width * 0.1,
      y: this.canvas.height * 0.05,
      width: this.canvas.width * 0.8,
      height: this.canvas.height * 0.9,
    };
  }

  selectObjectAt(x: number, y: number) {
    // Clear previous selection
    this.objects.forEach(o => (o.isSelected = false));
  
    // Top-most first
    const obj = [...this.objects]
      .reverse()
      .find(o => o.selectable && o.isHit(x, y));
  
    if (obj) {
      obj.isSelected = true;
    }
  
    this.render();
  }
  
  

  // Clear current selection
  
}
