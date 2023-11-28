"use client";

import { Tool } from "@/components/Tools/tool";
import { createContext, useContext, useState } from "react";

export interface DataContextProps {
  data: Tool<any>[];
  setData: React.Dispatch<React.SetStateAction<Tool<any>[]>>;
  undo: () => void;
}

export const DataContext = createContext<DataContextProps>({
  data: [],
  setData: () => {},
  undo: () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Tool<any>[]>([]);

  const undo = () => {
    setData((prev) => {
      if (!prev) return prev;
      return prev.slice(0, prev.length - 1);
    });
  };

  return (
    <DataContext.Provider value={{ data, setData, undo }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
