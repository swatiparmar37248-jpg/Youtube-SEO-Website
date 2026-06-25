import React, { useState } from "react";
import { Search, Bookmark, BookmarkCheck, Trash2, Calendar, FileText, ArrowUpRight, Video } from "lucide-react";
import { SEOProject } from "../types";

interface ProjectHistoryProps {
  projects: SEOProject[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onToggleSave: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectHistory({
  projects,
  activeProjectId,
  onSelectProject,
  onToggleSave,
  onDeleteProject,
}: ProjectHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "saved">("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.data.titles.some((t) => t.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.data.keywords.mainKeyword.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterMode === "all" || project.isSaved;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md p-6 flex flex-col h-[520px]">
      <div className="flex flex-col gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            SEO Campaign History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Recall, load, and manage your generated projects.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search titles, keywords, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shrink-0 text-xs font-semibold">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                filterMode === "all"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold"
                  : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setFilterMode("saved")}
              className={`px-3 py-2 cursor-pointer border-l border-slate-200 dark:border-slate-800 transition-colors ${
                filterMode === "saved"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold"
                  : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Saved ({projects.filter((p) => p.isSaved).length})
            </button>
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {filteredProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No campaigns found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
              {searchTerm ? "Try broadening your search term." : "Generate a campaign above to populate your history."}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isActive = project.id === activeProjectId;
            const primaryTitle = project.data.titles[0]?.text || "Untitled Project";

            return (
              <div
                key={project.id}
                className={`group p-4 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 relative ${
                  isActive
                    ? "bg-red-50/20 dark:bg-red-950/10 border-red-500/80 shadow-md ring-1 ring-red-500/25"
                    : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950/40 border-slate-100 dark:border-slate-800/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                    {project.options.contentType} • {project.options.language}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(project.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={project.isSaved ? "Unsave project" : "Save project"}
                    >
                      {project.isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info and Loader */}
                <button
                  onClick={() => onSelectProject(project.id)}
                  className="text-left w-full block focus:outline-none cursor-pointer"
                >
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {primaryTitle}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 italic font-sans">
                    Overview: {project.overview}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(project.createdAt)}
                    </span>
                    <span className="flex items-center gap-0.5 font-bold text-slate-500 dark:text-slate-400">
                      View SEO Dashboard
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
