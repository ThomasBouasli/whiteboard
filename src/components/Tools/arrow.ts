import { Tool, ToolJSON, Tools } from "./tool";
import rough from "roughjs";

type ArrowData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Arrow implements Tool<Arrow> {
  private data: ArrowData | undefined;
  private keepRatio: boolean = false;

  constructor(data?: ArrowData) {
    this.data = data;
  }

  onMouseDown(event: PointerEvent): void {
    this.data = {
      x: event.clientX,
      y: event.clientY,
      width: event.clientX,
      height: event.clientY,
    };
  }

  onMouseMove(event: PointerEvent): void {
    if (!this.data) return;

    this.data.width = event.clientX;
    this.data.height = event.clientY;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.data) return;

    const { x, y, width, height } = this.data;

    const rc = rough.canvas(ctx.canvas);

    rc.line(x, y, width, height);
    rc.linearPath([
      [width, height],
      [
        width - 20 * Math.cos(Math.atan2(width - x, height - y) - Math.PI / 4),
        height -
          -20 * Math.sin(Math.atan2(width - x, height - y) - Math.PI / 4),
      ],
      [width, height],
      [
        width - -20 * Math.cos(Math.atan2(width - x, height - y) + Math.PI / 4),
        height - 20 * Math.sin(Math.atan2(width - x, height - y) + Math.PI / 4),
      ],
    ]);
  }

  setKeepRatio(value: boolean): void {
    this.keepRatio = value;
  }

  fromJSON(data: ToolJSON): Arrow {
    return new Arrow(data.data);
  }

  toJSON(): ToolJSON {
    return {
      type: Tools.Arrow,
      data: this.data!,
    };
  }
}
