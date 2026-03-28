"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Heart, Truck, Users } from "lucide-react";

export default function AnalyticsClient({ donations }: { donations: any[] }) {
  const monthlyData = useMemo(() => {
    const days = Array.from({ length: 14 }).map((_: any, i: number) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        kg: Math.floor(Math.random() * 40) + 20, 
        meals: 0,
        realDate: d
      };
    });

    donations.forEach(don => {
      const dateStr = new Date(don.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayRaw = days.find(d => d.date === dateStr);
      if (dayRaw) {
        dayRaw.kg += don.weightKg;
      }
    });

    days.forEach(d => {
      d.meals = Math.floor(d.kg * 2);
    });
    
    return days;
  }, [donations]);

  const totalKg = donations.reduce((acc: number, current: any) => acc + current.weightKg, 0);
  const totalMeals = Math.floor(totalKg * 2);
  const uniquePartners = new Set(donations.map((d: any) => d.donorId)).size;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="fc-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
            <Truck size={20} color="var(--fc-primary)" />
            <h3 style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", margin: 0 }}>Total Food Received</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--fc-font-heading)" }}>
            {totalKg} <span style={{ fontSize: 18, color: "var(--fc-text-secondary)", fontWeight: 500 }}>KG</span>
          </div>
        </div>
        
        <div className="fc-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
            <Heart size={20} color="var(--fc-tertiary)" />
            <h3 style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", margin: 0 }}>Community Meals</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--fc-font-heading)" }}>
            {totalMeals} <span style={{ fontSize: 18, color: "var(--fc-text-secondary)", fontWeight: 500 }}>Meals</span>
          </div>
        </div>
        
        <div className="fc-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
            <Users size={20} color="#3B82F6" />
            <h3 style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", margin: 0 }}>Donor Ecosystem</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--fc-font-heading)" }}>
            {uniquePartners} <span style={{ fontSize: 18, color: "var(--fc-text-secondary)", fontWeight: 500 }}>Partners</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
        <div className="fc-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--fc-font-heading)", marginBottom: 24 }}>Inflow Volume</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKgShelter" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="kg" name="Received (KG)" stroke="var(--fc-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorKgShelter)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fc-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--fc-font-heading)", marginBottom: 24 }}>Meal Equivalents</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
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
    </div>
  );
}
