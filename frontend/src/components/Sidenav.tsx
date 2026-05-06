/**
 * Left sidenav. Sections: Workspace / Knowledge / Analytics / Admin.
 * Active route gets accent-brand left border + tinted bg + brand-tinted text.
 *
 * Width 240px expanded; can be collapsed to 64px (icons only) on a future
 * iteration. For now, expanded by default per spec.
 */
import clsx from "clsx";
import {
  BarChart3,
  BookOpen,
  Calculator,
  Cpu,
  FolderOpen,
  Info,
  LayoutDashboard,
  Layers,
  Lock,
  LogOut,
  Microscope,
  Network,
  Settings,
  ShieldCheck,
  Upload,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { AboutModal } from "./AboutModal";
import { useAuth } from "./AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  chip?: string;        // small inline chip (e.g. "CMS-0057-F")
  disabled?: boolean;
  adminOnly?: boolean;
  reviewerOrAdmin?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard",    href: "/dashboard",         icon: LayoutDashboard },
      { label: "Cases",        href: "/cases",             icon: FolderOpen, badge: "47" },
      { label: "Bulk import",  href: "/cases/bulk-import", icon: Upload, chip: "§ IV.A" },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { label: "Policies", href: "/policies", icon: BookOpen },
      { label: "Agents",   href: "/agents",   icon: Cpu },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Cohorts",         href: "/cohorts",     icon: BarChart3 },
      { label: "Reviewer queue",  href: "/reviewer",    icon: UserCheck, badge: "8", reviewerOrAdmin: true },
      { label: "Eval harness",    href: "/eval",        icon: Microscope, chip: "F1 .90" },
    ],
  },
  {
    label: "Business value",
    items: [
      { label: "ROI calculator",  href: "/roi",            icon: Calculator,  chip: "$1.26B" },
      { label: "Compliance",      href: "/compliance",     icon: ShieldCheck, chip: "LIVE" },
      { label: "Industrialize",   href: "/industrialize",  icon: Layers,      chip: "FOUNDRY" },
      { label: "Architecture",    href: "/architecture",   icon: Network,     chip: "5-LAYER" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Settings", href: "/settings", icon: Settings, adminOnly: true },
    ],
  },
];

export function Sidenav() {
  const { user, logout } = useAuth();
  const [aboutOpen, setAboutOpen] = useState(false);
  const role = user?.role ?? "coordinator";

  // Filter sections by role
  const visibleSections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.adminOnly && role !== "admin") return false;
      // Reviewer Queue is visible to all but RequireAuth blocks Coordinator
      // (we keep it visible so they understand the workflow exists).
      return true;
    }),
  })).filter((s) => s.items.length > 0);

  const initials = (user?.full_name ?? user?.email ?? "??")
    .split(/[@.\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "??";

  return (
    <>
      <aside
        className="w-60 shrink-0 border-r border-surface-border bg-surface-panel flex flex-col h-[calc(100vh-3.5rem)] sticky top-14"
        aria-label="Primary navigation"
      >
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" aria-label="Sections">
          {visibleSections.map((section) => (
            <div key={section.label} role="group" aria-labelledby={`section-${section.label}`}>
              <div
                id={`section-${section.label}`}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-faint"
              >
                {section.label}
              </div>
              <div className="mt-1 space-y-0.5">
                {section.items.map((item) => (
                  <NavItemRow key={item.href} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-surface-border">
          <div className="flex items-center gap-2 px-2 py-2 text-xs group">
            <div
              className="w-7 h-7 rounded-full bg-accent-brand/15 text-accent-brand flex items-center justify-center font-mono font-semibold text-[11px] shrink-0"
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-ink-primary font-medium truncate">
                {user?.full_name || user?.email || "—"}
              </div>
              <div className="text-[10px] text-ink-muted truncate">
                <span className="uppercase font-mono tracking-wider">{role}</span>
                {user?.organization_name && (
                  <>
                    <span className="mx-1" aria-hidden="true">·</span>
                    <span className="truncate">{user.organization_name}</span>
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-surface-raised transition-all focus:outline-none focus:ring-2 focus:ring-accent-brand focus:opacity-100"
              aria-label="About Authrex (build version, deployment mode, feature flags)"
              title="About Authrex"
            >
              <Info size={12} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={logout}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-surface-raised transition-all focus:outline-none focus:ring-2 focus:ring-accent-brand focus:opacity-100"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}

function NavItemRow({ item }: { item: NavItem }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-ink-faint cursor-not-allowed"
        title="Coming soon"
      >
        <Icon size={15} />
        <span className="flex-1">{item.label}</span>
        <Lock size={11} className="opacity-60" />
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors group relative",
          isActive
            ? "bg-accent-brand/10 text-accent-brand font-medium"
            : "text-ink-body hover:bg-surface-raised hover:text-ink-primary",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-accent-brand" />
          )}
          <Icon size={15} className={isActive ? "text-accent-brand" : ""} />
          <span className="flex-1 truncate">{item.label}</span>
          {item.chip && (
            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan">
              {item.chip}
            </span>
          )}
          {item.badge && (
            <span
              className={clsx(
                "text-[10px] font-mono px-1.5 py-0.5 rounded",
                isActive
                  ? "bg-accent-brand text-ink-invert"
                  : "bg-surface-border text-ink-muted group-hover:bg-surface-border-hi",
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
