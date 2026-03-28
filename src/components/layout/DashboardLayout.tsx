"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Heart,
  LayoutDashboard,
  Truck,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const donorLinks = [
  { href: "/donor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/donor/history", label: "History", icon: Package },
  { href: "/donor/analytics", label: "Analytics", icon: BarChart3 },
];

const shelterLinks = [
  { href: "/shelter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shelter/dispatch", label: "Active Dispatch", icon: Truck },
  { href: "/shelter/partners", label: "Partners", icon: Users },
  { href: "/shelter/analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isShelter = pathname.startsWith("/shelter");
  const links = isShelter ? shelterLinks : donorLinks;
  const roleLabel = isShelter ? "Shelter" : "Donor";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 240,
          background: "var(--fc-sidebar-bg)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : -240,
          zIndex: 50,
          transition: "left 0.3s ease",
        }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 20px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--fc-radius-sm)",
                background: "var(--fc-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={16} color="white" fill="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: "var(--fc-font-heading)",
                  color: "white",
                }}
              >
                Food
                <span style={{ color: "var(--fc-primary)" }}>Connect</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {roleLabel} Portal
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="show-mobile-inline"
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: "var(--fc-radius-sm)",
                  marginBottom: 2,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "white" : "rgba(255,255,255,0.5)",
                  background: isActive ? "var(--fc-sidebar-hover)" : "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <link.icon size={18} />
                {link.label}
                {isActive && (
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--fc-primary)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Schedule Pickup Button */}
        {!isShelter && (
          <div style={{ padding: "0 12px 12px" }}>
            <Link
              href="/donor?new=true"
              className="fc-btn-primary"
              style={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 13,
                padding: "10px 16px",
                borderRadius: "var(--fc-radius-full)",
              }}
            >
              <Package size={16} />
              Schedule Pickup
            </Link>
          </div>
        )}

        {/* Bottom: Settings + Logout */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link
            href="/settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: "var(--fc-radius-sm)",
              textDecoration: "none",
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              transition: "background 0.15s",
            }}
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: "var(--fc-radius-sm)",
              width: "100%",
              border: "none",
              background: "none",
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontFamily: "var(--fc-font-body)",
              transition: "background 0.15s",
            }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          flex: 1,
          marginLeft: 240,
          background: "var(--fc-bg)",
          minHeight: "100vh",
        }}
        className="main-content"
      >
        {/* Top Bar */}
        <header
          style={{
            height: 64,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--fc-border-light)",
            background: "var(--fc-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="show-mobile-inline"
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--fc-text)",
                padding: 4,
              }}
            >
              <Menu size={22} />
            </button>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "var(--fc-font-heading)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--fc-text-secondary)",
              }}
            >
              Kinetic Archive
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {session?.user && (
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "var(--fc-radius-sm)",
                    background: profileMenuOpen ? "var(--fc-surface-hover)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fc-text-secondary)" }}>
                    {session.user.organization || session.user.name}
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--fc-primary-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--fc-primary)",
                    }}
                  >
                    {(session.user.name || "U")[0].toUpperCase()}
                  </div>
                  <ChevronDown size={14} color="var(--fc-text-muted)" style={{ transform: profileMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <>
                    <div 
                      onClick={() => setProfileMenuOpen(false)} 
                      style={{ position: "fixed", inset: 0, zIndex: 90 }} 
                    />
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: 220,
                      background: "var(--fc-surface)",
                      borderRadius: "var(--fc-radius-md)",
                      border: "1px solid var(--fc-border)",
                      boxShadow: "var(--fc-shadow-lg)",
                      zIndex: 100,
                      overflow: "hidden"
                    }} className="animate-scale-in">
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--fc-border-light)", background: "var(--fc-bg)" }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{session.user.name}</div>
                        <div style={{ fontSize: 12, color: "var(--fc-text-muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{session.user.email}</div>
                      </div>
                      <div style={{ padding: 4 }}>
                        <Link href="/settings" onClick={() => setProfileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", fontSize: 13, color: "var(--fc-text)", textDecoration: "none", borderRadius: "var(--fc-radius-sm)", transition: "background 0.15s" }} className="hover:bg-[var(--fc-surface-hover)]">
                          <Settings size={16} /> Account Settings
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", fontSize: 13, color: "var(--fc-danger)", width: "100%", background: "none", border: "none", cursor: "pointer", borderRadius: "var(--fc-radius-sm)", transition: "background 0.15s", fontFamily: "var(--fc-font-body)", textAlign: "left" }} className="hover:bg-[var(--fc-danger-light)]">
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 24, flex: 1 }}>{children}</div>
      </main>

    </div>
  );
}
