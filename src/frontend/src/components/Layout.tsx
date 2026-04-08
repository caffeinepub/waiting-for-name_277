import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  principal: string | null;
  isAdmin?: boolean;
  onLogout: () => void;
}

export function Layout({
  children,
  principal,
  isAdmin,
  onLogout,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark">
      <Header principal={principal} isAdmin={isAdmin} onLogout={onLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      <footer className="py-2 px-4 border-t border-border bg-card/50 text-center shrink-0">
        <p className="text-[10px] text-muted-foreground">
          © {new Date().getFullYear()}. Направено со ❤️ користејќи{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
