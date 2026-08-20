"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "footer" | "header" | "ul" | "li";
  /** When true, each direct child gets staggered reveal delays */
  stagger?: boolean;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = false,
  rootMargin = "0px 0px -8% 0px",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, rootMargin]);

  const show = visible || reducedMotion;

  if (stagger) {
    return (
      <Tag
        ref={ref as never}
        className={cn("reveal-stagger", className)}
        data-visible={show ? "true" : "false"}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child;
          const el = child as ReactElement<{ className?: string; style?: CSSProperties }>;
          return cloneElement(el, {
            className: cn("reveal", show && "is-visible", el.props.className),
            style: {
              ...el.props.style,
              ["--stagger-index" as string]: index,
            },
          });
        })}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", show && "is-visible", className)}
    >
      {children}
    </Tag>
  );
}
