import { Button } from "@/components/ui/AppButton";
import { LogOut, Truck, User } from "lucide-react";

interface HeaderProps {
  principal: string | null;
  isAdmin?: boolean;
  onLogout: () => void;
}

export function Header({ principal, isAdmin = false, onLogout }: HeaderProps) {
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}…${principal.slice(-3)}`
    : null;

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 bg-card border-b border-border shadow-sm shrink-0"
      data-ocid="app-header"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded bg-primary/15 flex items-center justify-center border border-primary/30">
          <Truck className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold text-foreground font-display tracking-tight">
            МебелМенаџер
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Управување со товар
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {shortPrincipal && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted/50 border border-border text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="font-mono">{shortPrincipal}</span>
            {isAdmin && (
              <span className="text-accent font-bold ml-1">ADMIN</span>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          aria-label="Одјави се"
          data-ocid="logout-btn"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Одјави се</span>
        </Button>
      </div>
    </header>
  );
}
