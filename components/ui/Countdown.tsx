"use client";

import { useSyncExternalStore } from "react";
import { ui } from "@/content/copy";
import { site } from "@/content/site";

const subscribe = () => () => {};

function daysUntil(isoDate: string) {
  const ms = new Date(`${isoDate}T00:00:00`).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

/** Days until the exam. Falls back to a plain label unless `examDate` is set. */
export function Countdown({ className }: { className?: string }) {
  const days = useSyncExternalStore(
    subscribe,
    () => (site.examDate ? daysUntil(site.examDate) : null),
    () => null,
  );

  if (days === null || days < 0) return <span className={className}>{ui.examDay}</span>;

  const text =
    days === 0
      ? ui.today
      : days === 1
        ? ui.tomorrow
        : ui.daysToGo.replace("{n}", String(days));

  return <span className={className}>{text}</span>;
}
