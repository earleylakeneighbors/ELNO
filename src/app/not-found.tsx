import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Error 404</p>
      <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-foreground">
        This path leads
        <br />
        <em className="font-normal">into the lake.</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        That page may have moved, or the link might be out of date.
      </p>
      <Link
        href="/"
        className="group mt-10 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to the homepage
      </Link>
    </div>
  );
}
