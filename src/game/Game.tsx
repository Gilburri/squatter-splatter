import { lazy, Suspense, useEffect, useState } from "react";
import { setMuted } from "@/game/audio";
import { Overlay } from "@/game/Overlay";
import { useGame } from "@/game/store";

const Stage = lazy(() => import("@/game/Stage"));

export function Game() {
  const phase = useGame((s) => s.phase);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem("squatter-splatter-mute") === "1") {
        useGame.setState({ muted: true });
        setMuted(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const showWorld = mounted && phase !== "gate" && phase !== "left";

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg select-none">
      {showWorld ? (
        <Suspense fallback={<p className="absolute bottom-8 left-6 font-sans tracking-widest text-muted uppercase">Walking in.</p>}>
          <Stage />
        </Suspense>
      ) : null}
      <Overlay />
    </main>
  );
}
