import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Github,
  Youtube,
  Search,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  LayoutDashboard,
  Video
} from "lucide-react";
import { AdvancedOptions, SEOData, SEOProject } from "./types";
import InputSection from "./components/InputSection";
import DashboardStats from "./components/DashboardStats";
import ProjectHistory from "./components/ProjectHistory";
import SEOResultView from "./components/SEOResultView";

// Initial seeded project based on user's exact demo request
const SEEDED_PROJECT: SEOProject = {
  id: "seeded-voice-assistant",
  overview: "I made an AI voice assistant using ChatGPT and Twilio that can answer phone calls automatically.",
  options: {
    language: "English",
    contentType: "Tech",
    titleTone: "Viral",
    descriptionLength: "Medium",
  },
  createdAt: "2026-06-23T17:34:00.000Z",
  isSaved: true,
  data: {
    titles: [
      {
        text: "I Built an AI Voice Assistant That Answers My Phone Calls! (ChatGPT + Twilio)",
        style: "Viral",
        ctrExplanation: "High curiosity combined with well-known tech brands creates an irresistible click trigger."
      },
      {
        text: "How to Build an AI Phone Assistant with ChatGPT and Twilio",
        style: "Tutorial",
        ctrExplanation: "Clear, action-oriented tutorial title targeting high-intent search traffic."
      },
      {
        text: "My Phone is Now Run by AI (And It's Surprisingly Smart)",
        style: "Curiosity",
        ctrExplanation: "Casual, narrative title that sparks intense curiosity about the assistant's behavior."
      },
      {
        text: "Building a Full-Stack AI Voice Assistant (Step-by-Step Guide)",
        style: "Professional",
        ctrExplanation: "Appeals to developers seeking structured, professional implementations."
      },
      {
        text: "I Let ChatGPT Answer My Phone Calls for 24 Hours!",
        style: "Viral",
        ctrExplanation: "Extreme scenario/challenge format that historically generates massive CTR."
      },
      {
        text: "Automate Your Inbound Calls Using ChatGPT and Twilio APIs",
        style: "Professional",
        ctrExplanation: "Direct and technical, highly relevant for corporate or commercial developers."
      },
      {
        text: "AI Voice Assistant Tutorial: Twilio Node.js + OpenAI Setup",
        style: "Tutorial",
        ctrExplanation: "Packed with specific technical keywords for immediate search engine indexing."
      },
      {
        text: "This AI Answers My Phone Calls Better Than Me...",
        style: "Curiosity",
        ctrExplanation: "Humorous self-deprecation combined with AI capability triggers quick emotional clicks."
      },
      {
        text: "Stop Answering Calls: Code This ChatGPT Phone Assistant Now",
        style: "Viral",
        ctrExplanation: "Action-driven command style that grabs attention in crowded feeds."
      },
      {
        text: "How ChatGPT and Twilio Can Fully Automate Your Business Calls",
        style: "Educational",
        ctrExplanation: "Value-centric business optimization angle highlighting direct ROI."
      }
    ],
    thumbnailIdeas: [
      "I LET AI ANSWER!",
      "NO MORE CALLS",
      "CHATGPT PHONE",
      "AI ANSWERS CALLS",
      "TWILIO + OPENAI",
      "100% AUTOMATED",
      "IS THIS REAL?",
      "BUILD THIS!",
      "AI INBOUND CALL",
      "BYE TELEMARKETERS"
    ],
    description: `🚀 In this video, I will show you step-by-step how I built a fully automated AI Voice Assistant using ChatGPT and Twilio that answers phone calls automatically! 

We'll connect Twilio's webhook system to an Express backend server and stream conversations to OpenAI's GPT-4 API to enable human-like voice conversations in real time.

👇 TIMESTAMPS
0:00 - Introduction & Live Demo
1:30 - How the Architecture Works
3:00 - Setting up Twilio phone numbers
5:15 - Writing the Express server
8:45 - Integrating ChatGPT API
12:30 - Testing & Edge cases
14:50 - Outro & Next Steps

Get the full source code on my GitHub repository (link below) and don't forget to like, subscribe, and hit the notification bell for more AI tutorials!

🔗 SOCIALS & LINKS:
GitHub Repository: [Insert Link]
Discord Community: [Insert Link]
Follow me on Twitter: [Insert Link]

#AIVoiceAssistant #ChatGPT #Twilio #OpenAI #Automation #WebDev #Tutorial`,
    tags: [
      "ai voice assistant", "chatgpt phone calls", "twilio chatgpt tutorial", "automated phone calls", "openai voice assistant", "voice AI backend", "node js twilio", "chatgpt twilio webhook", "javascript ai assistant", "build ai assistant", "how to automate phone calls", "openai twilio node", "chatgpt integration", "telephony automation", "express js chatgpt", "ai developer tutorial", "gpt4 voice agent", "automated call system", "voice agent tutorial"
    ],
    hashtags: [
      "AIVoiceAssistant", "ChatGPT", "Twilio", "OpenAI", "Automation", "Developer", "WebDev", "Programming", "ArtificialIntelligence", "AITutorial", "NodeJS", "SoftwareEngineering", "APIs", "TechTutorial"
    ],
    keywords: {
      mainKeyword: "ai voice assistant chatgpt twilio",
      secondaryKeywords: [
        "automated phone calls", "twilio openai voice", "chatgpt calling tutorial", "realtime voice agent", "node.js twilio webhook"
      ],
      longTailKeywords: [
        "how to make an ai voice assistant using chatgpt and twilio", "automatic phone call answering with openai", "build an inbound voice chatbot with nodejs"
      ]
    },
    seoAnalysis: {
      seoScore: 94,
      viralScore: 88,
      keywordDensity: [
        { keyword: "AI Voice Assistant", density: "4.2%" },
        { keyword: "ChatGPT", density: "3.5%" },
        { keyword: "Twilio", density: "2.8%" },
        { keyword: "Automate", density: "1.9%" },
        { keyword: "Phone Calls", density: "1.5%" }
      ],
      trendingSuggestions: [
        "Real-time voice streaming with OpenAI",
        "Twilio speech-to-text integration",
        "AI customer support agents",
        "OpenAI Realtime API tutorial",
        "Vapi AI vs custom Twilio bot"
      ],
      optimizationsMade: [
        "Strategically injected main search keywords into first 150 characters of description.",
        "Created curiosity-driven titles with viral structures and exact keyword pairings.",
        "Included high-frequency search tags mimicking the actual queries used by tech learners."
      ]
    }
  }
};

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("assistant_theme");
    return (saved as "light" | "dark") || "dark";
  });

  const [projects, setProjects] = useState<SEOProject[]>(() => {
    const saved = localStorage.getItem("assistant_projects");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [SEEDED_PROJECT];
      }
    }
    return [SEEDED_PROJECT];
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    return SEEDED_PROJECT.id;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);

  // Sync theme
  useEffect(() => {
    localStorage.setItem("assistant_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Sync projects
  useEffect(() => {
    localStorage.setItem("assistant_projects", JSON.stringify(projects));
  }, [projects]);

  // Loading stage ticker to keep users engaged and informed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading || isRegenerating) {
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev + 1) % 4);
      }, 3500);
    } else {
      setLoadingStage(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, isRegenerating]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  const handleGenerateThumbnail = async (projectId: string) => {
    setIsGeneratingThumbnail(true);
    setError(null);
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoOverview: project.overview,
          contentType: project.options.contentType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate thumbnail.");
      }

      const { imageUrl, thumbnailPrompt } = await response.json();

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                aiThumbnailUrl: imageUrl,
                aiThumbnailPrompt: thumbnailPrompt,
                data: {
                  ...p.data,
                  aiThumbnailUrl: imageUrl,
                  aiThumbnailPrompt: thumbnailPrompt,
                },
              }
            : p
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate AI Thumbnail. Please check your FLUX_API_KEY.");
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleGenerate = async (overview: string, options: AdvancedOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const [seoRes, thumbnailRes] = await Promise.allSettled([
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoOverview: overview,
            ...options,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errData = await r.json();
            throw new Error(errData.error || "Failed to generate assets.");
          }
          return r.json() as Promise<SEOData>;
        }),
        fetch("/api/generate-thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoOverview: overview,
            contentType: options.contentType,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errData = await r.json();
            throw new Error(errData.error || "Failed to generate thumbnail.");
          }
          return r.json() as Promise<{ imageUrl: string; thumbnailPrompt: string }>;
        })
      ]);

      if (seoRes.status === "rejected") {
        throw seoRes.reason;
      }

      const generatedData: SEOData = seoRes.value;

      if (thumbnailRes.status === "fulfilled") {
        generatedData.aiThumbnailUrl = thumbnailRes.value.imageUrl;
        generatedData.aiThumbnailPrompt = thumbnailRes.value.thumbnailPrompt;
      } else {
        console.warn("Thumbnail generation failed or FLUX_API_KEY not set:", thumbnailRes.reason);
      }

      const newProject: SEOProject = {
        id: `project-${Date.now()}`,
        overview,
        options,
        createdAt: new Date().toISOString(),
        data: generatedData,
        isSaved: false,
        aiThumbnailUrl: generatedData.aiThumbnailUrl,
        aiThumbnailPrompt: generatedData.aiThumbnailPrompt,
      };

      setProjects((prev) => [newProject, ...prev]);
      setActiveProjectId(newProject.id);

      // Scroll smoothly down to the generated content package
      setTimeout(() => {
        document.getElementById("campaign-results-package")?.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const activeProject = projects.find((p) => p.id === activeProjectId);
    if (!activeProject) return;

    setIsRegenerating(true);
    setError(null);
    try {
      const [seoRes, thumbnailRes] = await Promise.allSettled([
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoOverview: activeProject.overview,
            ...activeProject.options,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errData = await r.json();
            throw new Error(errData.error || "Failed to regenerate assets.");
          }
          return r.json() as Promise<SEOData>;
        }),
        fetch("/api/generate-thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoOverview: activeProject.overview,
            contentType: activeProject.options.contentType,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errData = await r.json();
            throw new Error(errData.error || "Failed to regenerate thumbnail.");
          }
          return r.json() as Promise<{ imageUrl: string; thumbnailPrompt: string }>;
        })
      ]);

      if (seoRes.status === "rejected") {
        throw seoRes.reason;
      }

      const generatedData: SEOData = seoRes.value;

      if (thumbnailRes.status === "fulfilled") {
        generatedData.aiThumbnailUrl = thumbnailRes.value.imageUrl;
        generatedData.aiThumbnailPrompt = thumbnailRes.value.thumbnailPrompt;
      } else {
        generatedData.aiThumbnailUrl = activeProject.data.aiThumbnailUrl;
        generatedData.aiThumbnailPrompt = activeProject.data.aiThumbnailPrompt;
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                data: generatedData,
                createdAt: new Date().toISOString(),
                aiThumbnailUrl: generatedData.aiThumbnailUrl,
                aiThumbnailPrompt: generatedData.aiThumbnailPrompt,
              }
            : p
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to regenerate campaign.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleSave = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
  };

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to clear your local campaign history?")) {
      setProjects([SEEDED_PROJECT]);
      setActiveProjectId(SEEDED_PROJECT.id);
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const loadingMessages = [
    "Analyzing video semantics and finding underlying topic vectors...",
    "Querying trending search terms and evaluating target keyword density...",
    "Formulating 10 high-CTR curiosity title frameworks and tags...",
    "Drafting search-friendly description body with timeline anchor links...",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Decorative Gradients for premium SaaS feel */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-xl shadow-md shadow-red-600/15">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5 leading-none">
                YouTube SEO Assistant
                <span className="text-[9px] font-mono font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Pro AI
                </span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-medium">
                The ultimate keyword & metadata catalyst
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Credentials hint */}
            <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg border dark:border-slate-800">
              API Environment: Server Secured
            </span>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Dashboard Analytics Bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-red-600" />
            Creator Dashboard
          </h1>
          {projects.length > 1 && (
            <button
              onClick={handleResetStats}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-semibold cursor-pointer transition-colors"
            >
              Clear Local History
            </button>
          )}
        </div>
        <DashboardStats projects={projects} onResetStats={handleResetStats} />

        {/* Input & Form Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main generator inputs */}
          <div className="lg:col-span-2 space-y-8">
            <InputSection onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Error State */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/40 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">SEO Generation Failed</h4>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Loading Cover */}
            {(isLoading || isRegenerating) && (
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                  <Sparkles className="w-5 h-5 text-red-500 absolute top-3.5 left-3.5 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    {isRegenerating ? "Regenerating SEO Assets..." : "Assembling YouTube SEO Package..."}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 min-h-[36px] font-medium italic">
                    {loadingMessages[loadingStage]}
                  </p>
                </div>
              </div>
            )}

            {/* Core Output Results Visualizer */}
            {activeProject && !isLoading && !isRegenerating && (
              <div id="campaign-results-package">
                <SEOResultView
                  data={activeProject.data}
                  options={activeProject.options}
                  overview={activeProject.overview}
                  onRegenerate={handleRegenerate}
                  isRegenerating={isRegenerating}
                  onGenerateThumbnail={() => handleGenerateThumbnail(activeProject.id)}
                  isGeneratingThumbnail={isGeneratingThumbnail}
                />
              </div>
            )}

            {/* Prompt logic callout if no active project */}
            {!activeProject && !isLoading && (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
                <p className="text-sm text-slate-500">
                  Select a past campaign from history or enter an overview above to generate a new metadata pack.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Project History */}
          <div className="lg:col-span-1">
            <ProjectHistory
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => {
                setActiveProjectId(id);
                // Scroll smoothly to output
                setTimeout(() => {
                  document.getElementById("campaign-results-package")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              onToggleSave={handleToggleSave}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900/80 mt-16 bg-white dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md flex items-center justify-center font-mono text-[10px] font-bold">
              YT
            </div>
            <span>YouTube SEO & Content Assistant • Powered by Gemini 3.5 Flash</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Offline-First Persistence Enabled</span>
            <span>•</span>
            <span>Interactive Live Studio Mockups</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
