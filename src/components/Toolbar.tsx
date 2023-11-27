"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useTool } from "@/providers/ToolProvider";
import { Tools } from "./Tools/tool";
import { useEffect } from "react";
import { ArrowUp, Circle, Pen, RectangleHorizontal } from "lucide-react";

const Toolbar = () => {
  const { setSelectedTool, selectedTool } = useTool();

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
  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center justify-center w-fit h-fit bg-secondary p-1 rounded-md">
      <ToggleGroup type="single" value={selectedTool}>
        <ToggleGroupItem
          value={Tools.Arrow}
          onClick={() => setSelectedTool(Tools.Arrow)}
        >
          <ArrowUp size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Tools.Rectangle}
          onClick={() => setSelectedTool(Tools.Rectangle)}
        >
          <RectangleHorizontal size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Tools.Circle}
          onClick={() => setSelectedTool(Tools.Circle)}
        >
          <Circle size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Tools.Pen}
          onClick={() => setSelectedTool(Tools.Pen)}
        >
          <Pen size={14} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
export default Toolbar;
