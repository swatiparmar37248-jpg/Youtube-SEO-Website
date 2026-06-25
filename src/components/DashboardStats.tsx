import React from "react";
import { Award, Bookmark, BarChart3, Flame, RefreshCcw } from "lucide-react";
import { SEOProject } from "../types";

interface DashboardStatsProps {
  projects: SEOProject[];
  onResetStats: () => void;
}

export default function DashboardStats({ projects, onResetStats }: DashboardStatsProps) {
  const totalGenerations = projects.length;
  const savedProjectsCount = projects.filter((p) => p.isSaved).length;

  const avgSeoScore = totalGenerations
    ? Math.round(projects.reduce((acc, curr) => acc + curr.data.seoAnalysis.seoScore, 0) / totalGenerations)
    : 0;

  const avgViralScore = totalGenerations
    ? Math.round(projects.reduce((acc, curr) => acc + curr.data.seoAnalysis.viralScore, 0) / totalGenerations)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Total Generations Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex items-center gap-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Projects
          </span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
            {totalGenerations}
          </span>
        </div>
      </div>

      {/* Saved Projects Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex items-center gap-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
          <Bookmark className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Saved Campaigns
          </span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
            {savedProjectsCount}
          </span>
        </div>
      </div>

      {/* Avg SEO Score Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex items-center gap-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Avg SEO Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
              {avgSeoScore}
            </span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* Avg Viral Score Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex items-center gap-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Avg Viral Potential
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
              {avgViralScore}
            </span>
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
