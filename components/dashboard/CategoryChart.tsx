"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { categorySplit } from "@/lib/data";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

export default function CategoryChart() {
  const total = categorySplit.reduce((s, c) => s + c.value, 0);

  return (
    <Card padding="md">
      <SectionHeader
        title="Répartition"
        subtitle="Dépenses — mars 2026"
        className="mb-4"
      />

      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={categorySplit}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={68}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {categorySplit.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface-container-lowest)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0px 10px 30px rgba(43,52,55,0.10)",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            formatter={(value, name) => [`${value}%`, String(name)]}
          />
          <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "18px", fontWeight: 900, fill: "var(--on-surface)" }}>
            {total}%
          </text>
          <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fill: "var(--on-surface-variant)" }}>
            total
          </text>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-2 mt-3">
        {categorySplit.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{item.name}</span>
            </div>
            <span className="text-xs font-bold font-numeric" style={{ color: "var(--on-surface)" }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
