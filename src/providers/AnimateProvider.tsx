"use client";

import { createContext, useContext, useState } from "react";

export interface ToolContextProps {
  animate: boolean;
  setAnimate: (animate: boolean | ((prev: boolean) => boolean)) => void;
}

export const AnimateContext = createContext<ToolContextProps>({
  animate: false,
  setAnimate: () => {},
});

export const AnimateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [animate, setAnimate] = useState<boolean>(false);

  return (
    <AnimateContext.Provider value={{ animate, setAnimate }}>
      {children}
    </AnimateContext.Provider>
  );
};

export const useAnimate = () => {
  return {
    ...useContext(AnimateContext),
  };
};
