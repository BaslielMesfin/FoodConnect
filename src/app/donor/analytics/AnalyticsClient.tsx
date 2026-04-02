"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Heart, TrendingUp, CalendarDays } from "lucide-react";

export default function AnalyticsClient({ donations }: { donations: any[] }) {
  // Process data for charts
  const monthlyData = useMemo(() => {
    // This is a naive grouping by month for demonstration since dates are usually scattered
    // For a real app, we'd group by day of the last 30 days
    const days = Array.from({ length: 14 }).map((_: any, i: number) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        kg: 0,
        meals: 0,
        realDate: d
      };
    });

    // Populate with actual data if it falls on these days, otherwise keep mock base
    donations.forEach((don: any) => {
      const dateStr = new Date(don.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayRaw = days.find(d => d.date === dateStr);
      if (dayRaw) {
        dayRaw.kg += don.weightKg;
      }
    });

    days.forEach((d: any) => {
      d.meals = Math.floor(d.kg * 2); // 0.5kg roughly 1 meal
    });
    
    return days;
  }, [donations]);

  const totalKg = donations.reduce((acc: number, current: any) => acc + current.weightKg, 0);
  const totalMeals = Math.floor(totalKg * 2);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="fc-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
            <TrendingUp size={20} color="var(--fc-primary)" />
            <h3 style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", margin: 0 }}>Lifetime Food Rescued</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--fc-font-heading)" }}>
            {totalKg} <span style={{ fontSize: 18, color: "var(--fc-text-secondary)", fontWeight: 500 }}>KG</span>
          </div>
        </div>
        
        <div className="fc-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
            <Heart size={20} color="var(--fc-tertiary)" />
            <h3 style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", margin: 0 }}>Meals Provided</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--fc-font-heading)" }}>
            {totalMeals} <span style={{ fontSize: 18, color: "var(--fc-text-secondary)", fontWeight: 500 }}>Meals</span>
          </div>
        </div>
        
        <div className="fc-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
            <CalendarDays size={20} color="#3B82F6" />
            <h3 style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", margin: 0 }}>Active Days</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--fc-font-heading)" }}>
            {new Set(donations.map((d: any) => new Date(d.createdAt).toDateString())).size} <span style={{ fontSize: 18, color: "var(--fc-text-secondary)", fontWeight: 500 }}>Days</span>
          </div>
        </div>
      </div>

      <div className="fc-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--fc-font-heading)", marginBottom: 24 }}>Rescue Volume (Last 14 Days)</h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--fc-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--fc-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--fc-border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--fc-text-muted)" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--fc-text-muted)" }} />
              <Tooltip 
                contentStyle={{ borderRadius: "var(--fc-radius-md)", border: "none", boxShadow: "var(--fc-shadow-md)", fontSize: 14 }}
                labelStyle={{ fontWeight: 600, color: "var(--fc-text)", marginBottom: 4 }}
                itemStyle={{ color: "var(--fc-primary)", fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="kg" name="Rescued (KG)" stroke="var(--fc-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorKg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="fc-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--fc-font-heading)", marginBottom: 24 }}>Meals Distributed</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--fc-border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--fc-text-muted)" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--fc-text-muted)" }} />
              <Tooltip 
                cursor={{ fill: "var(--fc-surface-hover)" }}
                contentStyle={{ borderRadius: "var(--fc-radius-md)", border: "none", boxShadow: "var(--fc-shadow-md)", fontSize: 14 }}
              />
              <Bar dataKey="meals" name="Meals" fill="var(--fc-tertiary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
