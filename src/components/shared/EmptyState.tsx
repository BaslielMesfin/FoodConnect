"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string | ReactNode;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({ icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        background: "var(--fc-surface)",
        borderRadius: "var(--fc-radius-lg)",
        border: "1px dashed var(--fc-border)",
        margin: "12px 0",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--fc-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fc-text-muted)",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 18,
          fontFamily: "var(--fc-font-heading)",
          fontWeight: 700,
          color: "var(--fc-text)",
          margin: 0,
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, maxWidth: 360, lineHeight: 1.6, marginBottom: actionHref ? 24 : 0 }}>
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="fc-btn-primary"
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
