/**
 * Full app layout: TopBar + Sidenav + Main + global Cmd+K SearchPalette.
 * Routes render into <Outlet />.
 */
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { SearchPalette } from "./SearchPalette";
import { Sidenav } from "./Sidenav";
import { TopBar } from "./TopBar";

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-surface-bg text-ink-body">
      <TopBar onOpenSearch={openPalette} />

      <div className="flex">
        <Sidenav />

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <SearchPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
