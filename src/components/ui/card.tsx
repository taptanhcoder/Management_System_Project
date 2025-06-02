import React from "react";
import classNames from "classnames";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={classNames("rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={classNames("p-4", className)}>
      {children}
    </div>
  );
}
