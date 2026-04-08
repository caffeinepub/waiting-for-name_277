import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, e as cn } from "./index-CbpfYT_H.js";
import { X } from "./index-5CA7VSEo.js";
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
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl"
};
function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md"
}) {
  const overlayRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);
  reactExports.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: overlayRef,
      "aria-labelledby": "modal-title",
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      onClick: (e) => {
        if (e.target === overlayRef.current) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/80 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "dialog",
          {
            open: true,
            "aria-modal": "true",
            "aria-labelledby": "modal-title",
            className: cn(
              "relative z-10 w-full rounded-lg border border-border bg-card shadow-xl",
              "flex flex-col max-h-[90vh] m-0 p-0",
              sizeClasses[size]
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    id: "modal-title",
                    className: "text-base font-semibold text-foreground font-display",
                    children: title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: onClose,
                    "aria-label": "Затвори",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children }),
              footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-2 border-t border-border px-5 py-3", children: footer })
            ]
          }
        )
      ]
    }
  );
}
export {
  Modal as M,
  Plus as P,
  Package as a
};
