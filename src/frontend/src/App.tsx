import { Layout } from "@/components/Layout";
import { TabNav } from "@/components/TabNav";
import { Button } from "@/components/ui/AppButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import {
  useBootstrapAdmin,
  useIsAdmin,
  useIsApproved,
  useRequestApproval,
} from "@/hooks/useBackend";
import { NAV_TABS } from "@/types";
import type { TabId } from "@/types";
import {
  AlertCircle,
  LogIn,
  RefreshCw,
  ShieldAlert,
  Truck,
} from "lucide-react";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  Suspense,
  lazy,
  useState,
} from "react";

const ApprovalPage = lazy(() => import("@/pages/ApprovalPage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const ShipmentPage = lazy(() => import("@/pages/ShipmentPage"));
const VisualizerPage = lazy(() => import("@/pages/VisualizerPage"));

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[МебелМенаџер] Грешка во апликацијата:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background dark p-6 text-center">
            <div className="h-16 w-16 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="max-w-sm">
              <h2 className="text-xl font-bold font-display text-foreground mb-2">
                Настана грешка
              </h2>
              <p className="text-sm text-muted-foreground mb-1">
                Апликацијата наиде на неочекувана грешка. Освежете ја страницата
                и обидете се повторно.
              </p>
              {this.state.error && (
                <p className="text-xs font-mono text-muted-foreground/60 bg-muted/30 border border-border px-3 py-2 rounded mt-3 break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Освежи страница
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthenticatedApp() {
  const { isAuthenticated, isLoggingIn, principal, login, logout } = useAuth();
  const {
    data: isApproved,
    isLoading: approvalLoading,
    isError: approvalError,
  } = useIsApproved();
  const { data: isAdmin = false } = useIsAdmin();
  const requestApproval = useRequestApproval();
  const bootstrapAdmin = useBootstrapAdmin();

  const visibleTabs = NAV_TABS.filter((t) => !t.adminOnly || isAdmin);
  const [activeTab, setActiveTab] = useState<TabId>("orders");

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background dark p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-16 w-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
              МебелМенаџер
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Систем за управување со нарачки и товарење
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs rounded-lg border border-border bg-card p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Пријавете се со Internet Identity за пристап до системот.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => login()}
            loading={isLoggingIn}
            className="w-full"
            data-ocid="login-btn"
          >
            <LogIn className="h-4 w-4" />
            {isLoggingIn ? "Се пријавувате..." : "Пријавете се"}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-muted-foreground/40">Прв пат?</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => bootstrapAdmin.mutate()}
            loading={bootstrapAdmin.isPending}
            disabled={bootstrapAdmin.isSuccess}
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground h-7 px-3"
            data-ocid="bootstrap-admin-btn"
          >
            {bootstrapAdmin.isSuccess
              ? "✓ Администраторот е поставен"
              : bootstrapAdmin.isError
                ? "Грешка — обидете се повторно"
                : "Постави администратор"}
          </Button>
          {bootstrapAdmin.isError && (
            <p className="text-[11px] text-destructive/80 text-center max-w-[220px]">
              Прво пријавете се, потоа поставете администратор.
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} caffeine.ai
        </p>
      </div>
    );
  }

  // ── Checking approval ──────────────────────────────────────────────────────
  if (approvalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark">
        <LoadingSpinner size="lg" label="Се проверува пристап..." />
      </div>
    );
  }

  // ── Approval check error — treat same as not approved ─────────────────────
  if (approvalError || !isApproved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background dark p-6">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="h-16 w-16 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Чекате одобрување
          </h2>
          <p className="text-sm text-muted-foreground">
            Вашата сметка чека одобрување од администратор. Ќе добиете пристап
            откако администраторот ќе ја одобри вашата сметка.
          </p>
          {principal && (
            <p className="text-xs font-mono text-muted-foreground/60 bg-muted/40 px-3 py-1 rounded">
              {principal}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          {requestApproval.isSuccess && (
            <p className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-md">
              ✓ Барањето е испратено — администраторот ќе ве одобри наскоро.
            </p>
          )}
          {requestApproval.isError && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md">
              Грешка при испраќање — обидете се повторно.
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => requestApproval.mutate()}
            loading={requestApproval.isPending}
            disabled={requestApproval.isSuccess}
            data-ocid="request-approval-btn"
          >
            {requestApproval.isSuccess
              ? "✓ Барањето е испратено"
              : "Побарај одобрување"}
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            Одјави се
          </Button>
        </div>
      </div>
    );
  }

  // ── Main app ───────────────────────────────────────────────────────────────
  const validTab = visibleTabs.find((t) => t.id === activeTab)
    ? activeTab
    : (visibleTabs[0]?.id ?? "orders");

  const renderPage = () => {
    switch (validTab) {
      case "approval":
        return <ApprovalPage />;
      case "products":
        return <ProductsPage />;
      case "orders":
        return <OrdersPage />;
      case "shipment":
        return (
          <ShipmentPage
            onOpenVisualizer={(id) => {
              void id;
              setActiveTab("visualizer");
            }}
          />
        );
      case "visualizer":
        return <VisualizerPage />;
      default:
        return <OrdersPage />;
    }
  };

  return (
    <Layout principal={principal} isAdmin={isAdmin} onLogout={logout}>
      <TabNav
        tabs={visibleTabs}
        activeTab={validTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 overflow-auto">
        <Suspense
          fallback={
            <LoadingSpinner
              size="lg"
              fullPage
              label="Се вчитува страницата..."
            />
          }
        >
          <ErrorBoundary>{renderPage()}</ErrorBoundary>
        </Suspense>
      </div>
    </Layout>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <AuthenticatedApp />
    </ErrorBoundary>
  );
}
