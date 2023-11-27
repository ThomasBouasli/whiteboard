"use client";

import React, { useEffect } from "react";

import rough from "roughjs";
import { getStroke } from "perfect-freehand";

enum Tool {
  Rectangle = "rectangle",
  Circle = "circle",
  Arrow = "arrow",
  Pen = "pen",
}

type Data = {
  type: Tool;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: [number, number, number][];
};

const Canvas = () => {
  const [keepRatio, setKeepRatio] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Data[]>();
  const [tool, setTool] = React.useState<Tool>(Tool.Circle);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "r":
          setTool(Tool.Rectangle);
          break;
        case "c":
          setTool(Tool.Circle);
          break;
        case "a":
          setTool(Tool.Arrow);
          break;
        case "p":
          setTool(Tool.Pen);
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "z") {
        setData((prev) => {
          if (!prev) return prev;
          return prev.slice(0, prev.length - 1);
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setKeepRatio(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setKeepRatio(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const newData: Data = {
        type: tool,
        x: e.clientX,
        y: e.clientY,
        width: tool === Tool.Arrow ? e.clientX : 0,
        height: tool === Tool.Arrow ? e.clientY : 0,
        points: tool === Tool.Pen ? [[e.clientX, e.clientY, 2]] : undefined,
      };

      setData((prev) => {
        if (!prev) return [newData];

        return [...prev, newData];
      });
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return;

      setData((prev) => {
        if (!prev) return prev;

        const last = prev[prev.length - 1];

        switch (last.type) {
          case Tool.Rectangle:
            last.width = e.clientX - last.x;
            last.height = e.clientY - last.y;
            break;
          case Tool.Circle:
            last.width = (e.clientX - last.x) * 2;
            last.height = (e.clientY - last.y) * 2;
            break;
          case Tool.Arrow:
            last.width = e.clientX;
            last.height = e.clientY;
            break;
          case Tool.Pen:
            last.points?.push([e.clientX, e.clientY, 2]);
            break;
        }

        if (keepRatio) {
          const max = Math.max(last.width, last.height);

          last.width = max * Math.sign(last.width);
          last.height = max * Math.sign(last.height);
        }

        return [...prev.slice(0, prev.length - 1), last];
      });
    };
    canvas.addEventListener("pointerdown", handleMouseDown);
    canvas.addEventListener("pointermove", handleMouseMove);

    return () => {
      canvas.removeEventListener("pointerdown", handleMouseDown);
      canvas.removeEventListener("pointermove", handleMouseMove);
    };
  }, [tool, keepRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of data) {
      const rc = rough.canvas(canvas);

      switch (d.type) {
        case Tool.Rectangle:
          rc.polygon(
            [
              [d.x, d.y],
              [d.x + d.width, d.y],
              [d.x + d.width, d.y + d.height],
              [d.x, d.y + d.height],
            ],
            {
              seed: 2,
            }
          );
          break;
        case Tool.Circle:
          rc.ellipse(d.x, d.y, d.width, d.height, {
            seed: 2,
          });
          break;
        case Tool.Arrow:
          rc.line(d.x, d.y, d.width, d.height);
          rc.linearPath([
            [d.width, d.height],
            [
              d.width -
                20 *
                  Math.cos(
                    Math.atan2(d.width - d.x, d.height - d.y) - Math.PI / 4
                  ),
              d.height -
                -20 *
                  Math.sin(
                    Math.atan2(d.width - d.x, d.height - d.y) - Math.PI / 4
                  ),
            ],
            [d.width, d.height],
            [
              d.width -
                -20 *
                  Math.cos(
                    Math.atan2(d.width - d.x, d.height - d.y) + Math.PI / 4
                  ),
              d.height -
                20 *
                  Math.sin(
                    Math.atan2(d.width - d.x, d.height - d.y) + Math.PI / 4
                  ),
            ],
          ]);
          break;
        case Tool.Pen:
          const stroke = getStroke(d.points!, {
            size: 16,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
          });

          ctx.beginPath();
          for (let i = 0; i < stroke.length; i++) {
            const [x, y] = stroke[i];
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.fill();
          ctx.closePath();
          break;
      }
    }
  }, [data, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: "none" }}
      height={window && window.innerHeight}
      width={window && window.innerWidth}
      className="fixed top-0 left-0 h-screen w-screen bg-white touch-none cursor-crosshair"
    />
  );
};
export default Canvas;

const average = (a: number, b: number) => (a + b) / 2;

function getSvgPathFromStroke(stroke: number[][]) {
  const len = stroke.length;

  if (!len) {
    return "";
  }

  const first = stroke[0];
  let result = `M${first[0].toFixed(3)},${first[1].toFixed(3)}Q`;

  for (let i = 0, max = len - 1; i < max; i++) {
    const a = stroke[i];
    const b = stroke[i + 1];
    result += `${a[0].toFixed(3)},${a[1].toFixed(3)} ${average(
      a[0],
      b[0]
    ).toFixed(3)},${average(a[1], b[1]).toFixed(3)} `;
  }

  result += "Z";

  return result;
}
