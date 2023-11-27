import { Tool, ToolJSON, Tools } from "./tool";
import rough from "roughjs";

type CircleData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Circle implements Tool<Circle> {
  private data: CircleData | undefined;
  private keepRatio: boolean = false;

  constructor(data?: CircleData) {
    this.data = data;
  }

  onMouseDown(event: PointerEvent): void {
    this.data = {
      x: event.clientX,
      y: event.clientY,
      width: 0,
      height: 0,
    };
  }

  onMouseMove(event: PointerEvent): void {
    if (!this.data) return;

    this.data.width = event.clientX - this.data.x;
    this.data.height = event.clientY - this.data.y;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.data) return;

    const { x, y, width, height } = this.data;

    const rc = rough.canvas(ctx.canvas);

    rc.ellipse(x, y, width, height, {
      seed: 2,
    });
  }

  setKeepRatio(value: boolean): void {
    this.keepRatio = value;
  }

  fromJSON(data: ToolJSON): Circle {
    return new Circle(data.data);
  }

  toJSON(): ToolJSON {
    return {
      type: Tools.Circle,
      data: this.data!,
    };
  }
}
