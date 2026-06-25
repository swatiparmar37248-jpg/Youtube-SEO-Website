import React, { useState } from "react";
import { Sparkles, Settings2, Globe, Video, MessageSquare, ListCollapse, ChevronDown, RefreshCw } from "lucide-react";
import { AdvancedOptions } from "../types";

interface InputSectionProps {
  onGenerate: (overview: string, options: AdvancedOptions) => void;
  isLoading: boolean;
}

export default function InputSection({ onGenerate, isLoading }: InputSectionProps) {
  const [overview, setOverview] = useState("");
  const [options, setOptions] = useState<AdvancedOptions>({
    language: "English",
    contentType: "Tech",
    titleTone: "Viral",
    descriptionLength: "Medium",
  });
  const [showAdvanced, setShowAdvanced] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overview.trim()) return;
    onGenerate(overview, options);
  };

  const handleOptionChange = <K extends keyof AdvancedOptions>(key: K, value: AdvancedOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const characterCount = overview.length;

  const quickExamples = [
    "I made an AI voice assistant using ChatGPT and Twilio that can answer phone calls automatically.",
    "A comprehensive guide on how to start freelancing in 2026 as a web developer with zero experience.",
    "Reviewing the absolute best camera gear for travel vlogging on a tight budget.",
  ];

  return (
    <div id="generation-input-card" className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden transition-all duration-300">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Describe Your Video</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Our SEO engine will craft custom titles, descriptions, tags, and viral thumbnails.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="overview" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Video Overview / Concept / Script Outline <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="overview"
                className="w-full h-36 p-4 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none font-sans"
                placeholder="Example: I created a complete guide explaining how the YouTube algorithm works in 2026, teaching creators how to optimize average view duration and CTR..."
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                maxLength={2000}
                required
              />
              <span className="absolute bottom-3 right-3 text-xs font-mono text-slate-400 dark:text-slate-600">
                {characterCount}/2000 chars
              </span>
            </div>

            {/* Quick Ideas */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                Or choose a quick demo overview:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickExamples.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOverview(ex)}
                    className="text-left text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 py-1 px-2.5 rounded-lg bg-slate-50 hover:bg-red-50/50 dark:bg-slate-950 dark:hover:bg-red-950/20 border border-slate-100 dark:border-slate-800/50 transition-colors truncate"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced toggle */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-400" />
                Advanced Creator Options
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 animate-fadeIn">
                {/* Language selection */}
                <div className="space-y-1.5">
                  <label htmlFor="language" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Language
                  </label>
                  <select
                    id="language"
                    value={options.language}
                    onChange={(e) => handleOptionChange("language", e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Hinglish">Hinglish (Hindi written in Latin)</option>
                  </select>
                </div>

                {/* Content Type */}
                <div className="space-y-1.5">
                  <label htmlFor="contentType" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" /> Content Type
                  </label>
                  <select
                    id="contentType"
                    value={options.contentType}
                    onChange={(e) => handleOptionChange("contentType", e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 focus:outline-none"
                  >
                    <option value="Tutorial">How-To & Tutorial</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Tech">Tech & Gadgets</option>
                    <option value="Vlog">Vlogging & Lifestyle</option>
                    <option value="AI">Artificial Intelligence</option>
                    <option value="Education">Education & Science</option>
                    <option value="Shorts">YouTube Shorts</option>
                  </select>
                </div>

                {/* Title Tone */}
                <div className="space-y-1.5">
                  <label htmlFor="titleTone" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Title Tone
                  </label>
                  <select
                    id="titleTone"
                    value={options.titleTone}
                    onChange={(e) => handleOptionChange("titleTone", e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 focus:outline-none"
                  >
                    <option value="Viral">Viral (Intense Curiosity)</option>
                    <option value="Professional">Professional & Authoritative</option>
                    <option value="Clickbait">Clickbait (High CTR)</option>
                    <option value="Educational">Educational & Informative</option>
                  </select>
                </div>

                {/* Description Length */}
                <div className="space-y-1.5">
                  <label htmlFor="descriptionLength" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ListCollapse className="w-3.5 h-3.5" /> Desc. Length
                  </label>
                  <select
                    id="descriptionLength"
                    value={options.descriptionLength}
                    onChange={(e) => handleOptionChange("descriptionLength", e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 focus:outline-none"
                  >
                    <option value="Short">Short & Punchy (~150 words)</option>
                    <option value="Medium">Medium & SEO Rich (~300 words)</option>
                    <option value="Long">Long & Comprehensive (~600 words)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !overview.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-red-600/25 dark:shadow-red-950/30 transition-all disabled:opacity-50 disabled:pointer-events-none text-base cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing Overview & Generating SEO Assets...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate YouTube SEO Campaign
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
