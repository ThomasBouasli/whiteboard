"use client";

import React, { useEffect } from "react";

import { Tool, ToolFactory, Tools } from "./Tools/tool";
import { useTool } from "@/providers/ToolProvider";

const Canvas = () => {
  const [keepRatio, setKeepRatio] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Tool<any>[]>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { selectedTool } = useTool();

  useEffect(() => {
    // window cant be used in server side, useEffect ensures that this code is only run on client side
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef]);

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

    const handleMouseDown = (e: PointerEvent) => {
      const tool = ToolFactory.create(selectedTool);
      tool.onMouseDown(e);

      setData((prev) => {
        if (!prev) return [tool];
        return [...prev, tool];
      });
    };
    const handleMouseMove = (e: PointerEvent) => {
      if (e.buttons !== 1) return;
      if (!data) return;

      const tool = data[data.length - 1];

      tool.onMouseMove(e);

      setData((prev) => {
        if (!prev) return prev;

        const newData = [...prev];

        newData[newData.length - 1] = tool;

        return newData;
      });
    };
    canvas.addEventListener("pointerdown", handleMouseDown);
    canvas.addEventListener("pointermove", handleMouseMove);

    return () => {
      canvas.removeEventListener("pointerdown", handleMouseDown);
      canvas.removeEventListener("pointermove", handleMouseMove);
    };
  }, [selectedTool, keepRatio, data, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of data) {
      d.render(ctx);
    }
  }, [data, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: "none" }}
      className="fixed top-0 left-0 h-screen w-screen bg-white touch-none cursor-crosshair"
    />
  );
};
export default Canvas;
