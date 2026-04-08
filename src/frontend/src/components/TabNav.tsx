import { cn } from "@/lib/utils";
import type { NavTab, TabId } from "@/types";

interface TabNavProps {
  tabs: NavTab[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <nav
      aria-label="Главна навигација"
      className="flex items-end gap-0 overflow-x-auto scrollbar-hide border-b border-border bg-card"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          data-ocid={`tab-${tab.id}`}
          onClick={() => onTabChange(tab.id)}
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={cn(
            "relative px-4 py-3 text-sm whitespace-nowrap transition-smooth focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            activeTab === tab.id ? "tab-active" : "tab-inactive",
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
