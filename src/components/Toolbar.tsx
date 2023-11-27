"use client";

import { useTool } from "@/providers/ToolProvider";
import { Tools } from "./Tools/tool";
import { useEffect } from "react";

const Toolbar = () => {
  const { setSelectedTool } = useTool();

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "r":
          setSelectedTool(Tools.Rectangle);
          break;
        case "c":
          setSelectedTool(Tools.Circle);
          break;
        case "a":
          setSelectedTool(Tools.Arrow);
          break;
        case "p":
          setSelectedTool(Tools.Pen);
          break;
        default:
          break;
      }
    });
  }, [setSelectedTool]);

  // Toolbar is not rendered for now, but a actual toolbar will be added in the future
  return null;
};
export default Toolbar;
