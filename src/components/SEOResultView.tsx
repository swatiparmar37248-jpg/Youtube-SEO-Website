import React, { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Heading,
  Image,
  FileText,
  Tag,
  Hash,
  Activity,
  ThumbsUp,
  Flame,
  Award,
  TrendingUp,
  Sparkles,
  Download,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { SEOData, AdvancedOptions } from "../types";

interface SEOResultViewProps {
  data: SEOData;
  options: AdvancedOptions;
  overview: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onGenerateThumbnail: () => void;
  isGeneratingThumbnail: boolean;
}

export default function SEOResultView({
  data,
  options,
  overview,
  onRegenerate,
  isRegenerating,
  onGenerateThumbnail,
  isGeneratingThumbnail,
}: SEOResultViewProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "titles" | "thumbnails" | "description" | "tags" | "hashtags">("dashboard");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [editableDesc, setEditableDesc] = useState(data.description);
  const [selectedThumbnailIdea, setSelectedThumbnailIdea] = useState(data.thumbnailIdeas[0] || "TEXT IDEA");

  // Thumbnail Creator advanced states
  const [thumbnailType, setThumbnailType] = useState<"gradient" | "stock" | "upload" | "ai">("gradient");
  const [thumbnailBg, setThumbnailBg] = useState<string>("from-red-600 via-orange-500 to-yellow-500");
  const [stockImageUrl, setStockImageUrl] = useState<string>("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80");
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  
  const [fontSize, setFontSize] = useState<number>(72);
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [textY, setTextY] = useState<number>(360); // middle of 720px
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [canvasError, setCanvasError] = useState<string | null>(null);

  const STOCK_BACKGROUNDS = [
    { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80", name: "Cyberpunk Abstract" },
    { url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1280&q=80", name: "AI Neural Net" },
    { url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1280&q=80", name: "Retro Neon Vibe" },
    { url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1280&q=80", name: "Neon Gamer Room" },
    { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1280&q=80", name: "Cyber Arena" },
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1280&q=80", name: "Orange Minimal" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80", name: "Epic Mountains" },
    { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1280&q=80", name: "Adventure Road" },
  ];

  // Sync state if data changes
  React.useEffect(() => {
    setEditableDesc(data.description);
    if (data.thumbnailIdeas.length > 0) {
      setSelectedThumbnailIdea(data.thumbnailIdeas[0]);
    }
    if (data.aiThumbnailUrl) {
      setThumbnailType("ai");
    } else {
      setThumbnailType("gradient");
    }
  }, [data]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImageSrc(event.target.result as string);
          setThumbnailType("upload");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Compile and export a high-res 1280x720 PNG
  const handleDownloadThumbnail = async () => {
    setIsExporting(true);
    setCanvasError(null);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // 1. Draw Background
      if (thumbnailType === "gradient") {
        const grad = ctx.createLinearGradient(0, 0, 1280, 720);
        if (thumbnailBg.includes("from-red-600")) {
          grad.addColorStop(0, "#dc2626");
          grad.addColorStop(0.5, "#f97316");
          grad.addColorStop(1, "#eab308");
        } else if (thumbnailBg.includes("from-slate-900")) {
          grad.addColorStop(0, "#0f172a");
          grad.addColorStop(0.5, "#581c87");
          grad.addColorStop(1, "#312e81");
        } else if (thumbnailBg.includes("from-emerald-600")) {
          grad.addColorStop(0, "#059669");
          grad.addColorStop(0.5, "#14b8a6");
          grad.addColorStop(1, "#06b6d4");
        } else {
          grad.addColorStop(0, "#4f46e5");
          grad.addColorStop(1, "#ec4899");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);
      } else {
        // Load image (stock, custom or AI generated)
        const imgSrc = thumbnailType === "stock"
          ? stockImageUrl
          : (thumbnailType === "ai"
              ? data.aiThumbnailUrl
              : uploadedImageSrc);
        if (imgSrc) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load background image"));
            img.src = imgSrc;
          });

          // Draw cropped cover
          const imgRatio = img.width / img.height;
          const canvasRatio = 1280 / 720;
          let sWidth = img.width;
          let sHeight = img.height;
          let sx = 0;
          let sy = 0;

          if (imgRatio > canvasRatio) {
            sWidth = img.height * canvasRatio;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / canvasRatio;
            sy = (img.height - sHeight) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1280, 720);
        } else {
          // Fallback to dark gradient if no image
          ctx.fillStyle = "#1e1b4b";
          ctx.fillRect(0, 0, 1280, 720);
        }
      }

      // 2. Overlay abstract dark vignette layer for readability
      const vignette = ctx.createRadialGradient(640, 360, 200, 640, 360, 700);
      vignette.addColorStop(0, "rgba(0,0,0,0.1)");
      vignette.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 1280, 720);

      // 3. Draw simulated channel badge on top left
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(50, 45, 180, 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(options.contentType.toUpperCase(), 70, 71);

      // 4. Draw simulated Red "LIVE PREVIEW" badge on top right
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(1060, 45, 170, 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px monospace";
      ctx.fillText("CTR SEO BOOST", 1080, 71);

      // 5. Draw overlay text
      const rawText = useUppercase ? selectedThumbnailIdea.toUpperCase() : selectedThumbnailIdea;
      
      ctx.font = `extrabold ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Styling: Thick Stroke & Shadow
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 14;
      ctx.lineJoin = "miter";
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = textColor;

      // Wrapping Text Algorithm
      const words = rawText.split(" ");
      let line = "";
      const lines = [];
      const maxWidth = 1000;
      const lineHeight = fontSize * 1.15;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      // Draw all lines centered around Y
      let currentY = textY - ((lines.length - 1) * lineHeight) / 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i], 640, currentY);
        ctx.fillText(lines[i], 640, currentY);
        currentY += lineHeight;
      }

      // 6. Output Blob trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `YouTube_Thumbnail_${options.contentType}_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, "image/png");

    } catch (err) {
      console.error(err);
      setCanvasError("Error compiling image canvas. Note: Direct download of remote stock or AI images might be blocked by browser CORS security; try using standard Gradient background mode or upload a custom local image!");
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 50) return "text-amber-500 stroke-amber-500";
    return "text-red-500 stroke-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40";
    if (score >= 50) return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40";
    return "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40";
  };

  const renderDashboardTab = () => {
    const seoRadius = 40;
    const seoCircumference = 2 * Math.PI * seoRadius;
    const seoOffset = seoCircumference - (data.seoAnalysis.seoScore / 100) * seoCircumference;

    const viralRadius = 40;
    const viralCircumference = 2 * Math.PI * viralRadius;
    const viralOffset = viralCircumference - (data.seoAnalysis.viralScore / 100) * viralCircumference;

    return (
      <div className="space-y-6">
        {/* Scores Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* SEO Score Circular Gauge */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-500" />
                SEO Optimization Score
              </span>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Algorithmic Rank</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                Analyzes keyword placement in titles, description depth, and tagging coverage.
              </p>
            </div>
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-95">
                {/* Background Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={seoRadius}
                  className="stroke-slate-200 dark:stroke-slate-800 fill-transparent"
                  strokeWidth="8"
                />
                {/* Score Indicator Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={seoRadius}
                  className={`${getScoreColor(data.seoAnalysis.seoScore)} fill-transparent transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={seoCircumference}
                  strokeDashoffset={seoOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {data.seoAnalysis.seoScore}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  Excellent
                </span>
              </div>
            </div>
          </div>

          {/* Viral Score Circular Gauge */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-indigo-500 animate-pulse" />
                Viral Potential Score
              </span>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">CTR Catalyst</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                Measures emotional triggers, curiosity gap, and visual click-through appeal.
              </p>
            </div>
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-95">
                {/* Background Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={viralRadius}
                  className="stroke-slate-200 dark:stroke-slate-800 fill-transparent"
                  strokeWidth="8"
                />
                {/* Score Indicator Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={viralRadius}
                  className="stroke-indigo-500 fill-transparent transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={viralCircumference}
                  strokeDashoffset={viralOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {data.seoAnalysis.viralScore}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  High CTR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Density and Optimization list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Keyword Density */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/60 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              Keyword Density (Top 5 target tokens)
            </h4>
            <div className="space-y-3.5">
              {data.seoAnalysis.keywordDensity.map((kd, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 font-mono">"{kd.keyword}"</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">{kd.density}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full"
                      style={{
                        width: kd.density.includes("%")
                          ? `${Math.min(parseFloat(kd.density) * 15, 100)}%`
                          : "60%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Optimizations Done */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                Algorithmic Enhancements Applied
              </h4>
              <ul className="space-y-3">
                {data.seoAnalysis.optimizationsMade.map((opt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Suggestions */}
            <div className="mt-5 pt-4 border-t border-slate-150 dark:border-slate-800">
              <h5 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Breakout & Trending Suggestions
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {data.seoAnalysis.trendingSuggestions.map((trend, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full"
                  >
                    ↗ {trend}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview Visual Creator - REBUILT TO SUPPORT ACTUAL GRAPHICAL GENERATION & DOWNLOADS */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/60 p-6 rounded-2xl space-y-5">
          {canvasError && (
            <div className="p-4 text-xs font-semibold text-red-800 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-xl border border-red-250 dark:border-red-900/40 flex items-center justify-between">
              <span>{canvasError}</span>
              <button type="button" onClick={() => setCanvasError(null)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-extrabold px-2 cursor-pointer">✕</button>
            </div>
          )}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Image className="w-4 h-4 text-red-500" />
                  YouTube Thumbnail Canvas Creator & Image Downloader
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose templates, adjust styling sliders, load custom backgrounds, and generate real high-res PNG files.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={onGenerateThumbnail}
                  disabled={isGeneratingThumbnail}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer self-start sm:self-center"
                >
                  {isGeneratingThumbnail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating with FLUX...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      {data.aiThumbnailUrl ? "Regenerate Thumbnail (FLUX)" : "Generate Thumbnail (FLUX)"}
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadThumbnail}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 disabled:opacity-50 transition-all cursor-pointer self-start sm:self-center"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Compiling 1280x720 Image...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download High-Res Thumbnail (PNG)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Screen Preview (using real-time state and styles) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video w-full rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                
                {/* 1. Gradient Background */}
                {thumbnailType === "gradient" && (
                  <div className={`absolute inset-0 bg-gradient-to-tr ${thumbnailBg}`} />
                )}

                {/* 2. Stock Background */}
                {thumbnailType === "stock" && (
                  <img
                    src={stockImageUrl}
                    alt="Stock Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* 3. Uploaded Background */}
                {thumbnailType === "upload" && uploadedImageSrc && (
                  <img
                    src={uploadedImageSrc}
                    alt="Uploaded Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* 4. AI Generated Background */}
                {thumbnailType === "ai" && data.aiThumbnailUrl && (
                  <img
                    src={data.aiThumbnailUrl}
                    alt="AI Generated Background"
                    className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Aesthetic Vignette Darkening for Maximum CTR Readability */}
                <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/75 pointer-events-none" />

                {/* Channel Content Category Label */}
                <div className="absolute top-5 left-5 z-10 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-extrabold tracking-widest text-white px-3 py-1 rounded">
                  {options.contentType.toUpperCase()}
                </div>

                {/* Target CTR Badge */}
                <div className="absolute top-5 right-5 z-10 bg-red-600 text-white font-mono text-[10px] font-bold px-3 py-1 rounded tracking-wide shadow-md">
                  CTR SEO BOOST
                </div>

                {/* Live Floating Scaled Text Overlay */}
                <div
                  className="absolute inset-x-8 z-10 flex items-center justify-center text-center px-4"
                  style={{ top: `${(textY / 720) * 100}%`, transform: "translateY(-50%)" }}
                >
                  <h3
                    className="font-extrabold leading-none tracking-tighter uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
                    style={{
                      fontSize: `${(fontSize / 720) * 100}cqw`, // scaling with container width
                      color: textColor,
                      WebkitTextStroke: `4px ${strokeColor}`,
                      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
                    }}
                  >
                    {useUppercase ? selectedThumbnailIdea.toUpperCase() : selectedThumbnailIdea}
                  </h3>
                </div>

                {/* Video Duration Simulator */}
                <div className="absolute bottom-4 right-4 z-10 bg-black/90 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                  10:15
                </div>

                {/* Watermark Helper */}
                <div className="absolute bottom-4 left-4 z-10 text-[10px] text-white/50 font-medium">
                  YouTube Thumbnail Canvas Preview
                </div>
              </div>

              {/* Editing Controls & Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-100/50 dark:bg-slate-900/60 rounded-xl border dark:border-slate-850">
                <div className="space-y-3">
                  {/* Font Size slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>TEXT OVERLAY SIZE</span>
                      <span className="font-mono">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="36"
                      max="110"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>

                  {/* Verticial Position Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>TEXT HEIGHT ALIGNMENT</span>
                      <span className="font-mono">{textY}px</span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="550"
                      value={textY}
                      onChange={(e) => setTextY(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Colors selectors */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-slate-500 mb-1">TEXT COLOR</span>
                      <div className="flex gap-1.5">
                        {["#ffffff", "#facc15", "#4ade80", "#22d3ee"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setTextColor(color)}
                            className="w-6 h-6 rounded-full border border-white/20 shadow-sm cursor-pointer transition-transform hover:scale-110"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      <span className="block text-xs font-bold text-slate-500 mb-1">OUTLINE COLOR</span>
                      <div className="flex gap-1.5">
                        {["#000000", "#1e1b4b", "#991b1b", "#166534"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setStrokeColor(color)}
                            className="w-6 h-6 rounded-full border border-white/20 shadow-sm cursor-pointer transition-transform hover:scale-110"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Uppercase logic toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-500">FORCE ALL CAPS</span>
                    <button
                      onClick={() => setUseUppercase(!useUppercase)}
                      className={`text-[10px] font-bold px-3 py-1 rounded border transition-colors cursor-pointer ${
                        useUppercase
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {useUppercase ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Style Selection sidebar */}
            <div className="space-y-4">
              {/* Type toggle */}
              <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-[10px] font-bold">
                {data.aiThumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setThumbnailType("ai")}
                    className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                      thumbnailType === "ai"
                        ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                        : "bg-white dark:bg-slate-950 text-slate-500"
                    }`}
                  >
                    AI (FLUX)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setThumbnailType("gradient")}
                  className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                    thumbnailType === "gradient"
                      ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                      : "bg-white dark:bg-slate-950 text-slate-500"
                  }`}
                >
                  GRADIENT
                </button>
                <button
                  type="button"
                  onClick={() => setThumbnailType("stock")}
                  className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                    thumbnailType === "stock"
                      ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                      : "bg-white dark:bg-slate-950 text-slate-500"
                  }`}
                >
                  STOCK PHOTO
                </button>
                <button
                  type="button"
                  onClick={() => setThumbnailType("upload")}
                  className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                    thumbnailType === "upload"
                      ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                      : "bg-white dark:bg-slate-950 text-slate-500"
                  }`}
                >
                  CUSTOM
                </button>
              </div>

              {/* Conditionally render selectors */}
              {thumbnailType === "ai" && (
                <div className="space-y-3 p-3 bg-slate-100/60 dark:bg-slate-900/40 rounded-xl border dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    AI Generated Thumbnail (FLUX)
                  </span>
                  
                  {data.aiThumbnailUrl ? (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-extrabold text-slate-700 dark:text-slate-300">Generated Prompt:</span>
                        <p className="mt-1 p-2 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded font-mono text-[10px] max-h-24 overflow-y-auto leading-relaxed select-all">
                          {data.aiThumbnailPrompt}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={onGenerateThumbnail}
                        disabled={isGeneratingThumbnail}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-100 dark:text-slate-950 rounded-xl transition-all cursor-pointer shadow disabled:opacity-50"
                      >
                        {isGeneratingThumbnail ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Regenerating Image...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            Regenerate with FLUX
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No AI thumbnail generated yet. Ensure your FLUX_API_KEY is configured in the secrets panel.
                      </p>
                      <button
                        type="button"
                        onClick={onGenerateThumbnail}
                        disabled={isGeneratingThumbnail}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all cursor-pointer shadow disabled:opacity-50"
                      >
                        {isGeneratingThumbnail ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Generating Image...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Generate Thumbnail (FLUX)
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {thumbnailType === "gradient" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Choose Gradient style:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { style: "from-red-600 via-orange-500 to-yellow-500", label: "Sunset Fire" },
                      { style: "from-slate-900 via-purple-900 to-indigo-950", label: "Midnight Synth" },
                      { style: "from-emerald-600 via-teal-500 to-cyan-500", label: "Aqua Tech" },
                      { style: "from-indigo-600 to-pink-500", label: "Creative Duo" },
                    ].map((bg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setThumbnailBg(bg.style)}
                        className={`p-2.5 rounded-lg text-left text-xs font-bold border transition-all cursor-pointer flex flex-col gap-1.5 ${
                          thumbnailBg === bg.style
                            ? "bg-red-50 dark:bg-red-950/20 border-red-500"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`w-full h-8 rounded bg-gradient-to-r ${bg.style}`} />
                        <span className="text-[10px] block truncate">{bg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {thumbnailType === "stock" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Select High-CTR Stock Photo:
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {STOCK_BACKGROUNDS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setStockImageUrl(item.url)}
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                          stockImageUrl === item.url
                            ? "bg-red-50 dark:bg-red-950/20 border-red-500"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-10 object-cover rounded"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[9px] font-bold block truncate mt-1 text-slate-600 dark:text-slate-300">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {thumbnailType === "upload" && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Upload Custom Screenshot/Wallpaper:
                  </span>
                  
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <input
                      type="file"
                      id="thumbnail-image-uploader"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="thumbnail-image-uploader"
                      className="cursor-pointer block text-xs space-y-1 text-slate-500 hover:text-red-500"
                    >
                      <span className="font-extrabold text-red-600 dark:text-red-400 block mb-1">
                        + Select JPG/PNG
                      </span>
                      <span>Drop screenshot or click to browse.</span>
                    </label>
                  </div>

                  {uploadedImageSrc && (
                    <div className="p-2 border dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center gap-2">
                      <img
                        src={uploadedImageSrc}
                        alt="Uploaded Thumbnail Thumbnail"
                        className="w-12 h-8 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold block truncate text-slate-600 dark:text-slate-300">
                          Custom Background Active
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Text suggestions list */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Select Text Overlays:
                </span>
                <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                  {data.thumbnailIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedThumbnailIdea(idea)}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer truncate ${
                        selectedThumbnailIdea === idea
                          ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTitlesTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">10 SEO Optimzed YouTube Titles</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">CTR targeted and algorithm friendly.</p>
          </div>
          <button
            onClick={() => {
              const allTitles = data.titles.map((t, idx) => `${idx + 1}. ${t.text}`).join("\n");
              handleCopy(allTitles, "all-titles");
            }}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-bold cursor-pointer"
          >
            {copiedStates["all-titles"] ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied All
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy All
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {data.titles.map((title, idx) => {
            const charCount = title.text.length;
            const isWarn = charCount > 70; // 70 is standard recommended limit to avoid mobile truncation

            return (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-100/60 dark:bg-red-950/40 px-2 py-0.5 rounded">
                      {title.style}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isWarn
                        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                        : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                    }`}>
                      {charCount} / 100 chars {isWarn && "(Might truncate on mobile)"}
                    </span>
                  </div>
                  <h5 className="text-sm md:text-base font-extrabold text-slate-800 dark:text-slate-100 select-all font-sans leading-snug">
                    {title.text}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    <strong className="font-semibold text-slate-600 dark:text-slate-300">CTR Insights:</strong> {title.ctrExplanation}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(title.text, `title-${idx}`)}
                  className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors shrink-0 cursor-pointer self-end md:self-center"
                >
                  {copiedStates[`title-${idx}`] ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderThumbnailsTab = () => {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">10 Click-Targeted Thumbnail Texts</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Short, bold phrases designed for visual impact.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {data.thumbnailIdeas.map((idea, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Idea #{idx + 1}</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 select-all">
                  "{idea}"
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setSelectedThumbnailIdea(idea);
                    setActiveTab("dashboard");
                    // Scroll to preview studio
                    setTimeout(() => {
                      document.getElementById("generation-input-card")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="p-2 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                  title="Load in studio preview"
                >
                  Visual Studio
                </button>
                <button
                  onClick={() => handleCopy(idea, `thumb-${idx}`)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedStates[`thumb-${idx}`] ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDescriptionTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">YouTube Video Description</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">SEO-optimized formatting with high ranking power. Edit and customize below before copying.</p>
          </div>
          <button
            onClick={() => handleCopy(editableDesc, "desc")}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            {copiedStates["desc"] ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied Description
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Description
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <textarea
            value={editableDesc}
            onChange={(e) => setEditableDesc(e.target.value)}
            className="w-full h-[380px] p-4 text-sm font-sans text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border dark:border-slate-800">
            {editableDesc.length} characters • {editableDesc.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Pro Tip Callout */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-xs">
            <strong>SEO Pro Tip:</strong> Keep your main keyword in the first 2 lines (first 150 characters) to ensure it appears in Google & YouTube snippet search results!
          </p>
        </div>
      </div>
    );
  };

  const renderTagsTab = () => {
    const formattedTags = data.tags.join(", ");

    return (
      <div className="space-y-5">
        {/* Keywords Category Split */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            Target Keyword Mapping
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary */}
            <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                Primary Target (Main)
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 select-all font-mono">
                {data.keywords.mainKeyword}
              </span>
            </div>

            {/* Secondary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                Secondary Keywords
              </span>
              <div className="flex flex-wrap gap-1">
                {data.keywords.secondaryKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded select-all"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Long Tail */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                Long-Tail Variations
              </span>
              <div className="flex flex-wrap gap-1">
                {data.keywords.longTailKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded select-all"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Master Tags Container */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                YouTube Metadata Tags ({data.tags.length})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comma-separated keywords for YouTube Studio backend.</p>
            </div>
            <button
              onClick={() => handleCopy(formattedTags, "tags")}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-bold cursor-pointer"
            >
              {copiedStates["tags"] ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Tag Bundle
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Tag Bundle (CSV)
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 max-h-56 overflow-y-auto">
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:border-red-400 dark:hover:border-red-600 transition-colors select-all"
              >
                {tag}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(tag, `tag-${idx}`);
                  }}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 ml-1 shrink-0"
                >
                  {copiedStates[`tag-${idx}`] ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHashtagsTab = () => {
    const spaceHashtags = data.hashtags.map((h) => `#${h}`).join(" ");

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">YouTube SEO Hashtags</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Boost discovery in search and related feeds.</p>
          </div>
          <button
            onClick={() => handleCopy(spaceHashtags, "hashtags")}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-bold cursor-pointer"
          >
            {copiedStates["hashtags"] ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Hashtags
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Hashtags
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {data.hashtags.map((hash, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between"
            >
              <span className="text-xs font-bold text-red-600 dark:text-red-400 select-all font-sans truncate">
                #{hash}
              </span>
              <button
                onClick={() => handleCopy(`#${hash}`, `hash-${idx}`)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
              >
                {copiedStates[`hash-${idx}`] ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabItems = [
    { id: "dashboard", label: "Analytics & Studio", icon: <Activity className="w-4 h-4" /> },
    { id: "titles", label: `Titles (${data.titles.length})`, icon: <Heading className="w-4 h-4" /> },
    { id: "thumbnails", label: `Thumbnail Text (${data.thumbnailIdeas.length})`, icon: <Image className="w-4 h-4" /> },
    { id: "description", label: "SEO Description", icon: <FileText className="w-4 h-4" /> },
    { id: "tags", label: "Keywords & Tags", icon: <Tag className="w-4 h-4" /> },
    { id: "hashtags", label: "Hashtags", icon: <Hash className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden transition-all duration-300">
      {/* Header banner */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Generated SEO Campaign Results
          </span>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
            Optimized Campaign Package
          </h3>
        </div>

        {/* Regenerate Trigger */}
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 rounded-xl hover:text-red-600 dark:hover:text-red-400 transition-all active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
          {isRegenerating ? "Regenerating..." : "Regenerate Full Campaign"}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-white dark:bg-slate-900">
        <div className="flex px-4 min-w-[700px]">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content area */}
      <div className="p-6 md:p-8 min-h-[400px]">
        {activeTab === "dashboard" && renderDashboardTab()}
        {activeTab === "titles" && renderTitlesTab()}
        {activeTab === "thumbnails" && renderThumbnailsTab()}
        {activeTab === "description" && renderDescriptionTab()}
        {activeTab === "tags" && renderTagsTab()}
        {activeTab === "hashtags" && renderHashtagsTab()}
      </div>
    </div>
  );
}
