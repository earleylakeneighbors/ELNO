import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Quiet text link with a growing underline and a nudging arrow. */
export function ArrowLink({
  href,
  children,
  className,
  tone = "default",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "light";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium",
        tone === "light" ? "text-white" : "text-foreground",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-[0.35] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100",
            tone === "light" ? "bg-white/70" : "bg-foreground/60",
          )}
        />
      </span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

/** Section label: small caps text with a hairline, used above section titles. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary", className)}>
      <span className="h-px w-8 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}
