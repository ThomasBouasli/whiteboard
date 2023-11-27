"use client";

import { createContext, useContext, useState } from "react";

import { Tools } from "../components/Tools/tool";

export interface ToolContextProps {
  selectedTool: Tools;
  setSelectedTool: (tool: Tools) => void;
}

export const ToolContext = createContext<ToolContextProps>({
  selectedTool: Tools.Pen,
  setSelectedTool: () => {},
});

export const ToolProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);

  return (
    <ToolContext.Provider value={{ selectedTool, setSelectedTool }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => {
  return {
    ...useContext(ToolContext),
  };
};
