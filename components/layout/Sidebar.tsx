"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Swords,
  Network,
  Trophy,
  Radar,
  LineChart,
  BookMarked,
  HelpCircle,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/company", label: "Analyze Company", icon: Building2 },
  { href: "/analyze", label: "Analyze Startup", icon: Search },
  { href: "/challenge", label: "Challenge Mode", icon: Swords },
  { href: "/strategic-fit", label: "Strategic Fit", icon: Network },
  { href: "/world-cup", label: "World Cup Scout", icon: Trophy },
  { href: "/tech-radar", label: "Technology Radar", icon: Radar },
  { href: "/public-markets", label: "Public Markets", icon: LineChart },
  { href: "/saved", label: "Saved Research", icon: BookMarked },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="px-5 py-6">
        <div className="text-lg font-semibold tracking-tight text-ink-950">AARAN AI</div>
        <div className="text-xs font-medium text-ink-400">Junior VC Copilot</div>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-ink-950 text-white" : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ink-100 px-5 py-4 text-xs text-ink-400">
        Built by Aaran Chowdhery
      </div>
    </aside>
  );
}
