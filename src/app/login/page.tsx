"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/donor");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/donor" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--fc-bg)",
      }}
    >
      {/* Left side - branding */}
      <div
        style={{
          flex: 1,
          background: "var(--fc-sidebar-bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
        className="hide-mobile"
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,83,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,141,129,0.1) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 400 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--fc-radius-md)",
              background: "var(--fc-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Heart size={32} color="white" fill="white" />
          </div>
          <h1
            style={{
              fontSize: 36,
              color: "white",
              fontFamily: "var(--fc-font-heading)",
              marginBottom: 12,
            }}
          >
            Food<span style={{ color: "var(--fc-primary)" }}>Connect</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.6 }}>
            Rescue surplus food and deliver it to communities that need it most. Every meal matters.
          </p>

        </div>
      </div>

      {/* Right side - form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <div
            className="show-mobile"
            style={{
              display: "none",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--fc-radius-sm)",
                background: "var(--fc-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={20} color="white" fill="white" />
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: "var(--fc-font-heading)",
              }}
            >
              Food<span style={{ color: "var(--fc-primary)" }}>Connect</span>
            </span>
          </div>

          <h2
            style={{
              fontSize: 28,
              marginBottom: 8,
              fontFamily: "var(--fc-font-heading)",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              color: "var(--fc-text-secondary)",
              marginBottom: 32,
              fontSize: 15,
            }}
          >
            Sign in to manage your food rescue operations.
          </p>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "var(--fc-danger-light)",
                color: "var(--fc-danger)",
                borderRadius: "var(--fc-radius-sm)",
                fontSize: 14,
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid var(--fc-border)",
              borderRadius: "var(--fc-radius-sm)",
              background: "var(--fc-surface)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--fc-font-body)",
              color: "var(--fc-text)",
              transition: "all 0.2s",
              marginBottom: 24,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--fc-surface-hover)";
              e.currentTarget.style.borderColor = "var(--fc-text-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--fc-surface)";
              e.currentTarget.style.borderColor = "var(--fc-border)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
              color: "var(--fc-text-muted)",
              fontSize: 13,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--fc-border)" }} />
            or
            <div style={{ flex: 1, height: 1, background: "var(--fc-border)" }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="fc-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--fc-text-muted)",
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  className="fc-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="fc-label" htmlFor="login-password">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--fc-text-muted)",
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="fc-input"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--fc-text-muted)",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="fc-btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 14,
              color: "var(--fc-text-secondary)",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "var(--fc-primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
