import { useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function LineReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={`line-mask ${className}`}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.span
        variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
        transition={{ duration: 0.95, ease, delay: reduced ? 0 : delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduced ? 0.15 : 0.8,
        ease,
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 250, damping: 20 });
  const y = useSpring(0, { stiffness: 250, damping: 20 });
  return (
    <motion.span
      className={`magnetic ${className}`}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12);
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [interactive, setInteractive] = useState(false);
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const x = useSpring(px, { stiffness: 550, damping: 38 });
  const y = useSpring(py, { stiffness: 550, damping: 38 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(query.matches && !reduced);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const move = (event: PointerEvent) => {
      px.set(event.clientX);
      py.set(event.clientY);
      const element = event.target instanceof Element ? event.target : null;
      setVisible(!element?.closest("input, textarea, select"));
      setLabel(
        element?.closest("[data-cursor]")?.getAttribute("data-cursor") || "",
      );
      setInteractive(Boolean(element?.closest("a, button")));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, px, py]);

  if (!enabled) return null;
  return (
    <motion.div
      className={`custom-cursor ${label ? "has-label" : ""}`}
      style={{ left: x, top: y }}
      animate={{
        width: label ? 78 : interactive ? 36 : 10,
        height: label ? 78 : interactive ? 36 : 10,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      {label && <span>{label}</span>}
    </motion.div>
  );
}
