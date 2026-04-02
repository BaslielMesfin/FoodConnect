"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Truck,
  Heart,
  MapPin,
  ArrowRight,
  ChefHat,
  Building2,
  Shield,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";

/* ── Animated Counter ── */
function AnimatedCounter({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Feature Card ── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="fc-card fc-card-interactive"
      style={{
        padding: "32px",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--fc-radius-sm)",
          background: "var(--fc-primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={24} color="var(--fc-primary)" />
      </div>
      <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Step Card ── */
function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--fc-radius-full)",
          background: "var(--fc-primary)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "var(--fc-font-heading)",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>{title}</h3>
        <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Main Landing Page ── */
export default function LandingClient({ stats }: { stats: { kg: number, meals: number, partners: number } }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--fc-bg)" }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--fc-border-light)",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                color: "var(--fc-text)",
              }}
            >
              Food
              <span style={{ color: "var(--fc-primary)" }}>Connect</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/login"
              style={{
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--fc-text)",
                textDecoration: "none",
                borderRadius: "var(--fc-radius-sm)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--fc-surface-hover)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="fc-btn-primary"
              style={{ textDecoration: "none", padding: "10px 20px" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          paddingTop: 140,
          paddingBottom: 80,
          paddingLeft: 32,
          paddingRight: 32,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,200,83,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,141,129,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            position: "relative",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--fc-primary-light)",
              padding: "8px 16px",
              borderRadius: "var(--fc-radius-full)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--fc-primary-dark)",
              marginBottom: 24,
            }}
          >
            <Zap size={14} />
            Real-time food rescue logistics
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.1,
              marginBottom: 20,
              fontFamily: "var(--fc-font-heading)",
              letterSpacing: "-0.03em",
            }}
          >
            Rescue Food.
            <br />
            <span style={{ color: "var(--fc-primary)" }}>Feed Communities.</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--fc-text-secondary)",
              maxWidth: 560,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Connect surplus food from restaurants and hotels with shelters that need it
            most. Real-time dispatching, verified handoffs, zero waste.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/register"
              className="fc-btn-primary"
              style={{
                textDecoration: "none",
                padding: "14px 32px",
                fontSize: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Start Donating <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="fc-btn-secondary"
              style={{
                textDecoration: "none",
                padding: "14px 32px",
                fontSize: 16,
              }}
            >
              I&apos;m a Shelter
            </Link>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      <section
        style={{
          padding: "0 32px 80px",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              value: stats.kg,
              suffix: "",
              label: "Kilograms Rescued",
              icon: TrendingUp,
              color: "var(--fc-primary)",
            },
            {
              value: stats.meals,
              suffix: "",
              label: "Meals Provided",
              icon: Heart,
              color: "var(--fc-tertiary)",
            },
            {
              value: stats.partners,
              suffix: "",
              label: "Active Partners",
              icon: Building2,
              color: "var(--fc-secondary)",
            },
            {
              value: 12,
              suffix: " min",
              label: "Avg Response Time",
              icon: Clock,
              color: "#7C3AED",
            },
          ].map((stat: any) => (
            <div
              key={stat.label}
              className="fc-card"
              style={{
                padding: "28px 24px",
                textAlign: "center",
              }}
            >
              <stat.icon
                size={22}
                style={{ color: stat.color, marginBottom: 8 }}
              />
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  fontFamily: "var(--fc-font-heading)",
                  color: "var(--fc-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--fc-text-secondary)",
                  fontWeight: 500,
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        style={{
          padding: "80px 32px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>
            Built for <span style={{ color: "var(--fc-primary)" }}>Impact</span>
          </h2>
          <p style={{ color: "var(--fc-text-secondary)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Every feature designed to make food rescue faster, safer, and more transparent.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          <FeatureCard
            icon={MapPin}
            title="Live Map Tracking"
            description="See all available donations on an interactive map. Filter by proximity, food type, and urgency. Claim with one click."
            delay={0}
          />
          <FeatureCard
            icon={Shield}
            title="Verified Handoffs"
            description="4-digit PIN verification ensures every donation reaches the right hands. Complete chain of custody tracking."
            delay={100}
          />
          <FeatureCard
            icon={Zap}
            title="Real-time Dispatch"
            description="WebSocket-powered live updates. The moment food is posted, nearby shelters are notified instantly."
            delay={200}
          />
          <FeatureCard
            icon={Truck}
            title="Magic Driver Links"
            description="Generate shareable pickup links for volunteer drivers. No app install needed — just a mobile browser."
            delay={300}
          />
          <FeatureCard
            icon={Clock}
            title="Expiration Tracking"
            description="Visual countdown timers with urgency color-coding. Green → Yellow → Red as pickup windows close."
            delay={400}
          />
          <FeatureCard
            icon={ChefHat}
            title="Donor Analytics"
            description="Track your impact over time. See total kilograms rescued, meals provided, and community stats."
            delay={500}
          />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        style={{
          padding: "80px 32px",
          background: "var(--fc-surface)",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>
              How It <span style={{ color: "var(--fc-primary)" }}>Works</span>
            </h2>
            <p style={{ color: "var(--fc-text-secondary)", fontSize: 16 }}>
              Three simple steps to rescue food and feed your community.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <StepCard
              number={1}
              title="Donor Posts Surplus Food"
              description="Restaurants, hotels, and caterers submit details about available food — type, weight, expiration window, and pickup notes."
            />
            <StepCard
              number={2}
              title="Shelter Claims & Dispatches"
              description="Nearby shelters see the listing on their live map, claim it, and share a magic link with a volunteer driver."
            />
            <StepCard
              number={3}
              title="Verified Pickup & Delivery"
              description="The driver uses the magic link with GPS routing and a secret PIN to verify the handoff. Everyone is notified in real-time."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "48px 32px",
            background: "var(--fc-sidebar-bg)",
            borderRadius: "var(--fc-radius-lg)",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              marginBottom: 12,
              color: "white",
            }}
          >
            Ready to Make a{" "}
            <span style={{ color: "var(--fc-primary)" }}>Difference</span>?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: 28,
              fontSize: 15,
            }}
          >
            Join FoodConnect today. Whether you have food to share or mouths to feed — we connect you.
          </p>
          <Link
            href="/register"
            className="fc-btn-primary"
            style={{
              textDecoration: "none",
              padding: "14px 36px",
              fontSize: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "32px",
          textAlign: "center",
          borderTop: "1px solid var(--fc-border-light)",
          color: "var(--fc-text-muted)",
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <Heart size={14} color="var(--fc-primary)" fill="var(--fc-primary)" />
          <span style={{ fontWeight: 600, color: "var(--fc-text-secondary)" }}>FoodConnect</span>
        </div>
        © {new Date().getFullYear()} FoodConnect. Rescue Food, Feed Communities.
      </footer>
    </div>
  );
}
