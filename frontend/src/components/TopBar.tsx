/**
 * Top app bar (h-14, full-width). Contains:
 *   - Logo + brand text + tagline (clickable, navigates to /dashboard)
 *   - Cmd+K search trigger (opens SearchPalette)
 *   - Trust badges
 *   - Theme toggle
 */
import { Activity, Moon, Search, Sun } from "lucide-react";
import { Link } from "react-router-dom";

import { useTheme } from "../lib/theme";

interface Props {
  onOpenSearch: () => void;
}

export function TopBar({ onOpenSearch }: Props) {
  const { theme, toggle } = useTheme();

  return (
    <header className="h-14 border-b border-surface-border bg-surface-raised/85 backdrop-blur-md flex items-center px-5 gap-6 sticky top-0 z-30">
      <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-accent-brand text-ink-invert flex items-center justify-center shadow-sm">
          <Activity size={18} strokeWidth={2.5} />
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="font-semibold text-sm text-ink-primary">Authrex</div>
          <div className="text-[11px] text-ink-muted">
            Prior Auth Copilot · Oncology
          </div>
        </div>
      </Link>

      {/* Search trigger — keyboard-shortcut-styled button */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex-1 max-w-md flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-bg hover:bg-surface-raised-hi hover:border-surface-border-hi transition-colors text-sm text-ink-faint"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search cases, policies, agents...</span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-surface-border bg-surface-raised text-ink-muted">
          ⌘K
        </kbd>
      </button>

      <div className="hidden lg:flex items-center gap-2 text-[11px] text-ink-muted">
        <span className="font-mono px-2 py-1 rounded bg-surface-panel border border-surface-border">
          Team AeroFyta
        </span>
        <span className="font-mono px-2 py-1 rounded bg-surface-panel border border-surface-border">
          Cognizant Technoverse 2026
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-surface-raised-hi transition-colors"
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
