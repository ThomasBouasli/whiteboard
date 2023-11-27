import getStroke from "perfect-freehand";
import { Tool, ToolJSON, Tools } from "./tool";

type PenData = {
  x: number;
  y: number;
  height: number;
  width: number;
  points: [number, number, number][];
};

export class Pen implements Tool<Pen> {
  private data: PenData | undefined;
  private keepRatio: boolean = false;

  constructor(data?: PenData) {
    this.data = data;
  }

  onMouseDown(event: PointerEvent): void {
    const canvas = event.target as HTMLCanvasElement;
    canvas.setPointerCapture(event.pointerId);

    this.data = {
      x: event.clientX,
      y: event.clientY,
      width: 0,
      height: 0,
      points: [[event.clientX, event.clientY, event.pressure]],
    };
  }

  onMouseMove(event: PointerEvent): void {
    if (!this.data) return;

    this.data.width = Math.max(this.data.width, event.clientX - this.data.x);
    this.data.height = Math.max(this.data.height, event.clientY - this.data.y);

    this.data.points.push([event.clientX, event.clientY, event.pressure]);
  }

  render(ctx: CanvasRenderingContext2D, seed: number): void {
    if (!this.data) return;

    const { points } = this.data;

    const stroke = getStroke(
      points.map((data) => {
        return [
          data[0] + Math.cos(seed * Math.random()) * 1.5,
          data[1] + Math.sin(seed * Math.random()) * 1.5,
          data[2],
        ];
      }),
      {
        size: 4,
        thinning: 0.6,
        smoothing: 0,
        streamline: 0.5, // suavizador
        easing: (t) => t,
        last: true,
        simulatePressure: true,
      }
    );

    ctx.beginPath();
    for (let i = 0; i < stroke.length; i++) {
      const [x, y] = stroke[i];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.fillStyle = "hsl(289 62% 95%)";
    ctx.strokeStyle = "hsl(289 62% 95%)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  setKeepRatio(value: boolean): void {
    this.keepRatio = value;
  }

  fromJSON(data: ToolJSON): Pen {
    if (data.type !== Tools.Pen) throw new Error("Invalid type");

    return new Pen({
      ...data.data,
      points: data.data.points as [number, number, number][],
    });
  }

  toJSON(): ToolJSON {
    return {
      type: Tools.Pen,
      data: this.data!,
    };
  }
}
