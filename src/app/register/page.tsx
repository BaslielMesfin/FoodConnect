"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building2,
  ChefHat,
  Home,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"DONOR" | "SHELTER" | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, organization }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
      } else {
        router.push(role === "DONOR" ? "/donor" : "/shelter");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    document.cookie = `intended_role=${role}; path=/; max-age=3600;`;
    const callbackUrl = role === "DONOR" ? "/donor" : "/shelter";
    signIn("google", { callbackUrl });
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
            Join a growing network of food donors and shelters working together to eliminate food waste.
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
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2
            style={{
              fontSize: 28,
              marginBottom: 8,
              fontFamily: "var(--fc-font-heading)",
            }}
          >
            Create Account
          </h2>
          <p
            style={{
              color: "var(--fc-text-secondary)",
              marginBottom: 28,
              fontSize: 15,
            }}
          >
            {step === 1
              ? "First, tell us how you'll be using FoodConnect."
              : "Now let's set up your account details."}
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

          {step === 1 ? (
            /* ── Step 1: Role Selection ── */
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {[
                  {
                    value: "DONOR" as const,
                    icon: ChefHat,
                    title: "I'm a Food Donor",
                    desc: "Restaurant, hotel, caterer, or grocery store with surplus food",
                  },
                  {
                    value: "SHELTER" as const,
                    icon: Home,
                    title: "I'm a Shelter",
                    desc: "Community shelter, food bank, or non-profit receiving donations",
                  },
                ].map((opt: any) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    style={{
                      padding: "20px",
                      border: `2px solid ${role === opt.value ? "var(--fc-primary)" : "var(--fc-border)"}`,
                      borderRadius: "var(--fc-radius-md)",
                      background: role === opt.value ? "var(--fc-primary-light)" : "var(--fc-surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "var(--fc-radius-sm)",
                        background: role === opt.value ? "var(--fc-primary)" : "var(--fc-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      <opt.icon
                        size={22}
                        color={role === opt.value ? "white" : "var(--fc-text-secondary)"}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          fontFamily: "var(--fc-font-heading)",
                          color: "var(--fc-text)",
                          marginBottom: 2,
                        }}
                      >
                        {opt.title}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--fc-text-secondary)" }}>
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="fc-btn-primary"
                onClick={() => {
                  if (!role) {
                    setError("Please select a role");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* ── Step 2: Account Details ── */
            <div>
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--fc-surface)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="fc-label" htmlFor="reg-name">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fc-text-muted)" }} />
                    <input id="reg-name" type="text" className="fc-input" style={{ paddingLeft: 40 }} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="fc-label" htmlFor="reg-org">Organization Name</label>
                  <div style={{ position: "relative" }}>
                    <Building2 size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fc-text-muted)" }} />
                    <input id="reg-org" type="text" className="fc-input" style={{ paddingLeft: 40 }} placeholder={role === "DONOR" ? "Metro Central Kitchen" : "Hope Community Shelter"} value={organization} onChange={(e) => setOrganization(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="fc-label" htmlFor="reg-email">Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fc-text-muted)" }} />
                    <input id="reg-email" type="email" className="fc-input" style={{ paddingLeft: 40 }} placeholder="you@organization.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="fc-label" htmlFor="reg-password">Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fc-text-muted)" }} />
                    <input id="reg-password" type={showPassword ? "text" : "password"} className="fc-input" style={{ paddingLeft: 40, paddingRight: 40 }} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--fc-text-muted)", padding: 0 }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="fc-btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="fc-btn-primary"
                    disabled={loading}
                    style={{
                      flex: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {loading ? (
                      <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                    ) : (
                      <>
                        Create Account <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 14,
              color: "var(--fc-text-secondary)",
            }}
          >
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--fc-primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
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
        }
      `}</style>
    </div>
  );
}
