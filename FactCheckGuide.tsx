import * as React from "react";
import { motion } from "motion/react";

interface GaugeChartProps {
  score: number;
}

export function GaugeChart({ score }: GaugeChartProps) {
  let color = "text-emerald-500";
  let strokeColor = "stroke-emerald-500";
  let riskLevel = "안정 / 신뢰 가능 (Authentic)";
  if (score < 40) {
    color = "text-red-500";
    strokeColor = "stroke-red-500";
    riskLevel = "위험 / 조작 의심 (High Risk)";
  } else if (score < 75) {
    color = "text-yellow-500";
    strokeColor = "stroke-yellow-500";
    riskLevel = "주의 / 교차검증 필요 (Suspicious)";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-slate-100"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <motion.circle
          className={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center flex flex-col items-center">
        <span className={`text-4xl font-black block text-slate-800`}>{score}%</span>
        <span className={`text-[10px] font-bold ${color} uppercase tracking-widest mt-1`}>{riskLevel}</span>
      </div>
    </div>
  );
}
