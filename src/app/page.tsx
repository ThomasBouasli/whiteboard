import Canvas from "@/components/Canvas";
import Toolbar from "@/components/Toolbar";
import { AnimateProvider } from "@/providers/AnimateProvider";
import { ToolProvider } from "@/providers/ToolProvider";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AnimateProvider>
        <ToolProvider>
          <Toolbar />
          <Canvas />
        </ToolProvider>
      </AnimateProvider>
    </main>
  );
}
