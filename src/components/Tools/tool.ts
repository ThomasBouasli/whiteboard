import { Arrow } from "./arrow";
import { Circle } from "./circle";
import { Pen } from "./pen";
import { Rectangle } from "./rectangle";

export type ToolJSON = {
  type: Tools;
  data: {
    x: number;
    y: number;
    height: number;
    width: number;
    points?: [number, number, number][];
  };
};

export interface Tool<T extends Tool<T>> {
  render(ctx: CanvasRenderingContext2D, seed: number | null): void;
  onMouseDown(event: PointerEvent): void;
  onMouseMove(event: PointerEvent): void;
  setKeepRatio(value: boolean): void;
  toJSON(): ToolJSON;
  fromJSON(data: ToolJSON): T;
}

export enum Tools {
  Rectangle = "rectangle",
  Circle = "circle",
  Arrow = "arrow",
  Pen = "pen",
}

export class ToolFactory {
  static create(type: Tools): Tool<any> {
    switch (type) {
      case Tools.Rectangle:
        return new Rectangle();
      case Tools.Circle:
        return new Circle();
      case Tools.Arrow:
        return new Arrow();
      case Tools.Pen:
        return new Pen();
    }
  }
}
