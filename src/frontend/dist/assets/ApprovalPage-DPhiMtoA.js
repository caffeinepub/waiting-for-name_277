import { c as createLucideIcon, n as useApprovals, o as useSetApproval, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, A as ApprovalStatus, B as Button } from "./index-CbpfYT_H.js";
import { B as Badge } from "./badge-DpOzHE2R.js";
import { a as CircleCheck, C as Clock } from "./clock-Ck6WwRyC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
function truncatePrincipal(text) {
  if (text.length <= 24) return text;
  return `${text.slice(0, 10)}...${text.slice(-8)}`;
}
const STATUS_CONFIG = {
  [ApprovalStatus.pending]: {
    label: "Во чекање",
    variant: "outline",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" })
  },
  [ApprovalStatus.approved]: {
    label: "Одобрен",
    variant: "default",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" })
  },
  [ApprovalStatus.rejected]: {
    label: "Одбиен",
    variant: "destructive",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" })
  }
};
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: cfg.variant, className: "flex items-center gap-1 text-xs", children: [
    cfg.icon,
    cfg.label
  ] });
}
function ApprovalRow({
  request,
  onApprove,
  onReject,
  isPending,
  actionTarget
}) {
  const principalText = request.principal.toText();
  const isActing = isPending && actionTarget === principalText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
      "data-ocid": "approval-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm font-mono text-foreground truncate",
            title: principalText,
            children: truncatePrincipal(principalText)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: request.status }) }),
        request.status === ApprovalStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: () => onApprove(principalText),
              loading: isActing,
              disabled: isPending && actionTarget !== principalText,
              "data-ocid": "approve-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                "Одобри"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: () => onReject(principalText),
              loading: isActing,
              disabled: isPending && actionTarget !== principalText,
              "data-ocid": "reject-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-3.5 w-3.5" }),
                "Одбиј"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function StatsBar({ requests }) {
  const pending = requests.filter(
    (r) => r.status === ApprovalStatus.pending
  ).length;
  const approved = requests.filter(
    (r) => r.status === ApprovalStatus.approved
  ).length;
  const rejected = requests.filter(
    (r) => r.status === ApprovalStatus.rejected
  ).length;
  const stats = [
    { label: "Вкупно", value: requests.length, color: "text-foreground" },
    { label: "Во чекање", value: pending, color: "text-accent" },
    { label: "Одобрени", value: approved, color: "text-chart-2" },
    { label: "Одбиени", value: rejected, color: "text-destructive" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg bg-card border border-border px-4 py-3 flex flex-col gap-0.5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-2xl font-bold font-display ${s.color}`, children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: s.label })
      ]
    },
    s.label
  )) });
}
const FILTER_OPTIONS = [
  { value: "all", label: "Сите" },
  { value: ApprovalStatus.pending, label: "Во чекање" },
  { value: ApprovalStatus.approved, label: "Одобрени" },
  { value: ApprovalStatus.rejected, label: "Одбиени" }
];
function ApprovalPage() {
  const { data: approvals, isLoading, isError } = useApprovals();
  const setApproval = useSetApproval();
  const [filter, setFilter] = reactExports.useState("all");
  const [actionTarget, setActionTarget] = reactExports.useState(null);
  function handleApprove(principal) {
    setActionTarget(principal);
    setApproval.mutate(
      { principal, approved: true },
      { onSettled: () => setActionTarget(null) }
    );
  }
  function handleReject(principal) {
    setActionTarget(principal);
    setApproval.mutate(
      { principal, approved: false },
      { onSettled: () => setActionTarget(null) }
    );
  }
  const filtered = (approvals == null ? void 0 : approvals.filter((r) => filter === "all" || r.status === filter)) ?? [];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[300px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Се вчитуваат барањата..." }) });
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[300px] gap-3 text-center px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-10 w-10 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Грешка при вчитување на барањата. Обидете се повторно." })
    ] });
  }
  const isEmpty = (approvals ?? []).length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground tracking-tight", children: "Одобрување на корисници" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Прегледајте и управувајте со барања за пристап до системот." })
    ] }),
    !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, { requests: approvals ?? [] }),
    !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap gap-2 mb-4",
        "aria-label": "Филтрирај по статус",
        children: FILTER_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setFilter(opt.value),
            className: [
              "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
              filter === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60"
            ].join(" "),
            "data-ocid": `filter-${opt.value}`,
            children: opt.label
          },
          opt.value
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: isEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-3 py-16 px-6 text-center",
        "data-ocid": "approvals-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-muted/40 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Нема барања за одобрување" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Корисниците кои побарале пристап ќе се прикажат овде." })
        ]
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-2 py-12 px-6 text-center",
        "data-ocid": "approvals-filtered-empty",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Нема барања со избраниот статус." })
      }
    ) : filtered.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApprovalRow,
      {
        request: req,
        onApprove: handleApprove,
        onReject: handleReject,
        isPending: setApproval.isPending,
        actionTarget
      },
      req.principal.toText()
    )) }),
    !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground text-right", children: [
      filtered.length,
      " од ",
      (approvals == null ? void 0 : approvals.length) ?? 0,
      " барање(а)"
    ] })
  ] });
}
export {
  ApprovalPage as default
};
