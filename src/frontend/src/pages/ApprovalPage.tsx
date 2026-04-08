import { Badge } from "@/components/ui/AppBadge";
import { Button } from "@/components/ui/AppButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ApprovalStatus } from "@/hooks/useBackend";
import { useApprovals, useSetApproval } from "@/hooks/useBackend";
import type { UserApprovalInfo } from "@/types";
import { CheckCircle2, Clock, ShieldCheck, UserX, XCircle } from "lucide-react";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncatePrincipal(text: string): string {
  if (text.length <= 24) return text;
  return `${text.slice(0, 10)}...${text.slice(-8)}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApprovalStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  [ApprovalStatus.pending]: {
    label: "Во чекање",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
  },
  [ApprovalStatus.approved]: {
    label: "Одобрен",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  [ApprovalStatus.rejected]: {
    label: "Одбиен",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge variant={cfg.variant} className="flex items-center gap-1 text-xs">
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}

// ─── Approval Row ─────────────────────────────────────────────────────────────

interface ApprovalRowProps {
  request: UserApprovalInfo;
  onApprove: (principal: string) => void;
  onReject: (principal: string) => void;
  isPending: boolean;
  actionTarget: string | null;
}

function ApprovalRow({
  request,
  onApprove,
  onReject,
  isPending,
  actionTarget,
}: ApprovalRowProps) {
  const principalText = request.principal.toText();
  const isActing = isPending && actionTarget === principalText;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
      data-ocid="approval-row"
    >
      {/* Avatar */}
      <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
        <ShieldCheck className="h-4 w-4 text-primary" />
      </div>

      {/* Principal */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-mono text-foreground truncate"
          title={principalText}
        >
          {truncatePrincipal(principalText)}
        </p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusBadge status={request.status} />
      </div>

      {/* Actions — only for pending */}
      {request.status === ApprovalStatus.pending && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={() => onApprove(principalText)}
            loading={isActing}
            disabled={isPending && actionTarget !== principalText}
            data-ocid="approve-btn"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Одобри
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onReject(principalText)}
            loading={isActing}
            disabled={isPending && actionTarget !== principalText}
            data-ocid="reject-btn"
          >
            <UserX className="h-3.5 w-3.5" />
            Одбиј
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Summary Stats ────────────────────────────────────────────────────────────

function StatsBar({ requests }: { requests: UserApprovalInfo[] }) {
  const pending = requests.filter(
    (r) => r.status === ApprovalStatus.pending,
  ).length;
  const approved = requests.filter(
    (r) => r.status === ApprovalStatus.approved,
  ).length;
  const rejected = requests.filter(
    (r) => r.status === ApprovalStatus.rejected,
  ).length;

  const stats = [
    { label: "Вкупно", value: requests.length, color: "text-foreground" },
    { label: "Во чекање", value: pending, color: "text-accent" },
    { label: "Одобрени", value: approved, color: "text-chart-2" },
    { label: "Одбиени", value: rejected, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg bg-card border border-border px-4 py-3 flex flex-col gap-0.5"
        >
          <span className={`text-2xl font-bold font-display ${s.color}`}>
            {s.value}
          </span>
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Filter type ──────────────────────────────────────────────────────────────

type FilterStatus = "all" | ApprovalStatus;

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Сите" },
  { value: ApprovalStatus.pending, label: "Во чекање" },
  { value: ApprovalStatus.approved, label: "Одобрени" },
  { value: ApprovalStatus.rejected, label: "Одбиени" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApprovalPage() {
  const { data: approvals, isLoading, isError } = useApprovals();
  const setApproval = useSetApproval();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [actionTarget, setActionTarget] = useState<string | null>(null);

  function handleApprove(principal: string) {
    setActionTarget(principal);
    setApproval.mutate(
      { principal, approved: true },
      { onSettled: () => setActionTarget(null) },
    );
  }

  function handleReject(principal: string) {
    setActionTarget(principal);
    setApproval.mutate(
      { principal, approved: false },
      { onSettled: () => setActionTarget(null) },
    );
  }

  const filtered =
    approvals?.filter((r) => filter === "all" || r.status === filter) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" label="Се вчитуваат барањата..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center px-6">
        <XCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Грешка при вчитување на барањата. Обидете се повторно.
        </p>
      </div>
    );
  }

  const isEmpty = (approvals ?? []).length === 0;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
          Одобрување на корисници
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Прегледајте и управувајте со барања за пристап до системот.
        </p>
      </div>

      {!isEmpty && <StatsBar requests={approvals ?? []} />}

      {!isEmpty && (
        <div
          className="flex flex-wrap gap-2 mb-4"
          aria-label="Филтрирај по статус"
        >
          {FILTER_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={[
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                filter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60",
              ].join(" ")}
              data-ocid={`filter-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {isEmpty ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center"
            data-ocid="approvals-empty"
          >
            <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Нема барања за одобрување
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Корисниците кои побарале пристап ќе се прикажат овде.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 py-12 px-6 text-center"
            data-ocid="approvals-filtered-empty"
          >
            <p className="text-sm text-muted-foreground">
              Нема барања со избраниот статус.
            </p>
          </div>
        ) : (
          filtered.map((req) => (
            <ApprovalRow
              key={req.principal.toText()}
              request={req}
              onApprove={handleApprove}
              onReject={handleReject}
              isPending={setApproval.isPending}
              actionTarget={actionTarget}
            />
          ))
        )}
      </div>

      {!isEmpty && (
        <p className="mt-3 text-xs text-muted-foreground text-right">
          {filtered.length} од {approvals?.length ?? 0} барање(а)
        </p>
      )}
    </div>
  );
}
