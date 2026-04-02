"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  Package,
  Users,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import gsap from "gsap";

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
      className="fc-card hover-lift hover-glow animate-fade-in"
      style={{
        padding: "32px",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--fc-radius-md)",
          background: "var(--fc-primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={24} color="var(--fc-primary)" />
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 8, fontFamily: "var(--fc-font-heading)", fontWeight: 600 }}>{title}</h3>
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
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }} className="hover-lift">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--fc-radius-full)",
          background: "linear-gradient(135deg, var(--fc-primary) 0%, var(--fc-primary-dark) 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "var(--fc-font-heading)",
          flexShrink: 0,
          boxShadow: "0 4px 10px rgba(0, 200, 83, 0.2)",
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ fontSize: 17, marginBottom: 4, fontFamily: "var(--fc-font-heading)", fontWeight: 600 }}>{title}</h3>
        <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Main Landing Page ── */
export default function LandingClient({ stats }: { stats: { kg: number, meals: number, partners: number } }) {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
      
      tl.from(".stagger-line", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        delay: 0.2,
      })
      .from(pRef.current, {
        y: 20,
        opacity: 0,
      }, "-=0.8")
      .from(btnRef.current, {
        y: 20,
        opacity: 0,
      }, "-=0.6");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--fc-bg)", color: "var(--fc-text)", fontFamily: "var(--fc-font-body)" }}>
      {/* ── Navigation ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? "12px 32px" : "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          background: scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--fc-radius-md)",
              background: "linear-gradient(135deg, var(--fc-primary) 0%, var(--fc-primary-dark) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)",
            }}
          >
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--fc-font-heading)", letterSpacing: "-0.04em" }}>
            Food<span style={{ color: "var(--fc-primary)" }}>Connect</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hide-mobile">
          {["Impact", "How it Works", "Partners"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--fc-text-secondary)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-[var(--fc-primary)]">
              {item}
            </a>
          ))}
          <div style={{ width: 1, height: 20, background: "var(--fc-border)", margin: "0 8px" }} />
          <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "var(--fc-text)", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link href="/register" className="fc-btn-primary hover-glow" style={{ padding: "10px 24px", borderRadius: "var(--fc-radius-lg)", textDecoration: "none", fontSize: 13, boxShadow: "0 4px 15px rgba(0, 200, 83, 0.15)" }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        style={{
          paddingTop: 180,
          paddingBottom: 120,
          background: "radial-gradient(circle at 80% 20%, rgba(0, 200, 83, 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(255, 141, 129, 0.05) 0%, transparent 40%)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div className="stagger-line" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "rgba(0, 200, 83, 0.08)", color: "var(--fc-primary-dark)", borderRadius: "var(--fc-radius-full)", fontSize: 12, fontWeight: 700, marginBottom: 28, textTransform: "uppercase", letterSpacing: "0.1em", backdropFilter: "blur(4px)", border: "1px solid rgba(0, 200, 83, 0.1)" }}>
            <div style={{ width: 6, height: 6, background: "var(--fc-primary)", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            Beta Launching in Addis Ababa
          </div>
          
          <h1 style={{ fontSize: "clamp(40px, 7.5vw, 68px)", lineHeight: 1.05, marginBottom: 24, fontFamily: "var(--fc-font-heading)", fontWeight: 700, letterSpacing: "-0.05em" }}>
            <div className="stagger-line">Rescue Food.</div>
            <div className="stagger-line" style={{ color: "var(--fc-primary)", background: "linear-gradient(135deg, var(--fc-primary) 0%, #009688 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Empower Lives.
            </div>
          </h1>
          
          <p ref={pRef} style={{ fontSize: "clamp(17px, 2.2vw, 20px)", color: "var(--fc-text-secondary)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 400 }}>
            The smartest real-time network connecting food surplus with local shelters. <br className="hide-mobile" /> 
            Together, we can eliminate waste and solve hunger.
          </p>

          <div ref={btnRef} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }} className="flex-col-mobile">
            <Link href="/register" className="fc-btn-primary hover-glow" style={{ padding: "16px 40px", fontSize: 16, borderRadius: "var(--fc-radius-xl)", textDecoration: "none", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 25px rgba(0, 200, 83, 0.2)" }}>
              Start Donating Now <ArrowRight size={20} />
            </Link>
            <Link href="#how-it-works" className="fc-btn-secondary" style={{ padding: "16px 40px", fontSize: 16, borderRadius: "var(--fc-radius-xl)", textDecoration: "none", background: "white" }}>
              Learn How it Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Impact Stats Section ── */}
      <section id="impact" style={{ padding: "40px 24px 100px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {[
            { value: stats.kg, suffix: " KG", label: "Surplus Rescued", icon: Package, color: "var(--fc-primary)" },
            { value: stats.meals, suffix: "", label: "Meals Provided", icon: Heart, color: "#E91E63" },
            { value: stats.partners, suffix: "", label: "Active Partners", icon: Users, color: "#2196F3" },
            { value: 98.2, suffix: "%", label: "Handoff Rate", icon: ShieldCheck, color: "var(--fc-secondary)" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="fc-card hover-lift hover-glow animate-fade-in"
              style={{ padding: 40, textAlign: "center", animationDelay: `${i * 100}ms`, borderTop: `4px solid ${stat.color}` }}
            >
              <div style={{ margin: "0 auto 20px", width: 56, height: 56, background: `${stat.color}10`, color: stat.color, borderRadius: "var(--fc-radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={26} />
              </div>
              <div style={{ fontSize: 38, fontWeight: 700, fontFamily: "var(--fc-font-heading)", marginBottom: 6, letterSpacing: "-0.04em" }}>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" style={{ padding: "120px 24px", background: "white", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <h2 style={{ fontSize: "clamp(30px, 4.5vw, 42px)", fontFamily: "var(--fc-font-heading)", marginBottom: 16, fontWeight: 700, letterSpacing: "-0.03em" }}>Transparent Logistics</h2>
            <p style={{ color: "var(--fc-text-secondary)", maxWidth: 640, margin: "0 auto", fontSize: 17, lineHeight: 1.6 }}>Real-time coordination between donors, shelters, and volunteers.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <StepCard number={1} title="Post Surplus" description="Restaurants/hotels list available items with weights and pickup windows in seconds." />
              <StepCard number={2} title="Instant Dispatch" description="Local shelters receive notification and claim the donation for their community." />
              <StepCard number={3} title="Verified Handoff" description="Magic links and unique PINs ensure the food reaches the authorized destination safely." />
            </div>
            
            <div className="animate-scale-in" style={{ background: "var(--fc-bg)", borderRadius: "var(--fc-radius-xl)", padding: 40, border: "1px solid var(--fc-border)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, padding: "10px 18px", background: "var(--fc-primary)", color: "white", fontWeight: 700, fontSize: 11, borderBottomLeftRadius: "var(--fc-radius-md)", letterSpacing: "0.05em" }}>LIVE FEED</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { from: "Metro Grill", action: "posted 12kg sandwiches", time: "just now" },
                  { from: "Unity Shelter", action: "claimed donation", time: "2m ago" },
                  { from: "Central Hotel", action: "verified handoff", time: "15m ago" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: 16, borderBottom: i < 2 ? "1px solid var(--fc-border)" : "none" }}>
                    <div style={{ width: 8, height: 8, background: i === 0 ? "var(--fc-primary)" : "var(--fc-border)", borderRadius: "50%" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{item.from}</div>
                      <div style={{ fontSize: 13, color: "var(--fc-text-secondary)" }}>{item.action}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--fc-text-muted)" }}>{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: "120px 24px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <h2 style={{ fontSize: "clamp(30px, 4.5vw, 38px)", fontFamily: "var(--fc-font-heading)", marginBottom: 16, fontWeight: 700 }}>Built for Scale</h2>
          <p style={{ color: "var(--fc-text-secondary)", maxWidth: 500, margin: "0 auto", fontSize: 16 }}>Sophisticated tools to manage food rescue at city-wide scale.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <FeatureCard icon={MapPin} title="Smart Mapping" description="Interactive maps with urgency color-coding and turn-by-turn routing for volunteers." delay={0} />
          <FeatureCard icon={Shield} title="Safety First" description="Verified chain of custody and rigorous handler PIN verification for every rescue." delay={100} />
          <FeatureCard icon={Zap} title="Instant Alerts" description="Real-time WebSocket notifications ensure food is claimed within minutes of posting." delay={200} />
          <FeatureCard icon={Truck} title="Volunteer Links" description="Unique magic links that work in any browser — no driver app installation required." delay={300} />
          <FeatureCard icon={Clock} title="Smart Windows" description="Dynamic timers that prioritize the most urgent rescuable items automatically." delay={400} />
          <FeatureCard icon={TrendingUp} title="Impact Reports" description="Visual analytics to track your organization's carbon offset and community contribution." delay={500} />
        </div>
      </section>

      {/* ── CTA Container ── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)", borderRadius: "var(--fc-radius-xl)", padding: "100px 48px", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "var(--fc-shadow-xl)" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "rgba(0, 200, 83, 0.15)", filter: "blur(60px)", borderRadius: "50%" }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(30px, 3.5vw, 42px)", color: "white", fontFamily: "var(--fc-font-heading)", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.03em" }}>
              Join the <span style={{ color: "var(--fc-primary)" }}>Zero-Waste</span> Movement
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 540, margin: "0 auto 40px", fontSize: 17, lineHeight: 1.6 }}>
              Whether you are a donor looking to share or a shelter looking to receive — we are here to connect you.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }} className="flex-col-mobile">
              <Link href="/register" className="fc-btn-primary hover-glow" style={{ padding: "16px 40px", fontSize: 15, borderRadius: "var(--fc-radius-lg)", textDecoration: "none" }}>
                Create Free Account
              </Link>
              <Link href="/about" style={{ padding: "16px 40px", fontSize: 15, borderRadius: "var(--fc-radius-lg)", textDecoration: "none", color: "white", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "60px 24px", borderTop: "1px solid var(--fc-border-light)", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Heart size={24} color="var(--fc-primary)" fill="var(--fc-primary)" />
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--fc-font-heading)" }}>FoodConnect</span>
            </div>
            <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
              Fighting food waste and hunger through real-time logistics and community empowerment in Addis Ababa.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 80 }} className="flex-col-mobile">
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Platform</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Our Mission", "How it Works", "Safety", "Verification"].map(l => (
                  <a key={l} href="#" style={{ color: "var(--fc-text-secondary)", textDecoration: "none", fontSize: 13 }}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ color: "var(--fc-text-secondary)", fontSize: 13 }}>hello@foodconnect.et</span>
                <span style={{ color: "var(--fc-text-secondary)", fontSize: 13 }}>+251 900 000 00</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "40px auto 0", paddingTop: 40, borderTop: "1px solid var(--fc-border-light)", textAlign: "center", fontSize: 13, color: "var(--fc-text-muted)" }}>
          © {new Date().getFullYear()} FoodConnect. All rights reserved. 
        </div>
      </footer>
    </div>
  );
}
