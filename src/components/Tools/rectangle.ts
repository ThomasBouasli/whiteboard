import { Tool, ToolJSON, Tools } from "./tool";
import rough from "roughjs";

type RectangleData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Rectangle implements Tool<Rectangle> {
  private data: RectangleData | undefined;
  private keepRatio: boolean = false;

  constructor(data?: RectangleData) {
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

  render(ctx: CanvasRenderingContext2D, seed: number): void {
    if (!this.data) return;

    const { x, y, width, height } = this.data;

    const rc = rough.canvas(ctx.canvas);

    rc.polygon(
      [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
      ],
      {
        seed,
        bowing: 2,
        hachureAngle: 60,
        roughness: 1.5,
        strokeWidth: 2,
        stroke: "hsl(289 62% 95%)",
      }
    );
  }

  setKeepRatio(value: boolean): void {
    this.keepRatio = value;
  }

  fromJSON(data: ToolJSON): Rectangle {
    return new Rectangle(data.data);
  }

  toJSON(): ToolJSON {
    return {
      type: Tools.Rectangle,
      data: this.data!,
    };
  }
}
