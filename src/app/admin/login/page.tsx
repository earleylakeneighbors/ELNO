"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAnimate } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { loginAction } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurFade } from "@/components/ui/blur-fade";

const initial: ActionResult | null = null;

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [showPw, setShowPw] = useState(false);
  const failed = state && !state.success;
  const [scope, animate] = useAnimate<HTMLFormElement>();

  // Shake the form on each failed attempt.
  useEffect(() => {
    if (state && !state.success && scope.current) {
      void animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
    }
  }, [state, animate, scope]);

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Photo panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/hero-lake.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2f30]/85 via-[#1f2f30]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <BlurFade delay={0.2}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Earley Lake Neighborhood Organization
            </p>
            <p className="mt-3 max-w-md font-display text-4xl leading-tight">
              Our Lake. Our Neighborhood. Our Community.
            </p>
            <p className="mt-3 text-sm text-white/70">Burnsville, Minnesota</p>
          </BlurFade>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center px-4 py-12">
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <BlurFade className="relative w-full max-w-sm">
          <Link
            href="/"
            className="group mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to website
          </Link>
          <Image
            src="/images/elno-logo.png"
            alt=""
            width={52}
            height={52}
            className="rounded-full object-cover ring-4 ring-primary/10"
          />
          <h1 className="mt-5 font-display text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with an admin account to manage the neighborhood site.
          </p>

          <form ref={scope} action={formAction} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" name="email" type="email" autoComplete="username" required className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {failed ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </BlurFade>
      </div>
    </div>
  );
}
