export interface TitleIdea {
  text: string;
  style: string;
  ctrExplanation: string;
}

export interface KeywordDensity {
  keyword: string;
  density: string;
}

export interface KeywordData {
  mainKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
}

export interface SEOAnalysis {
  seoScore: number;
  viralScore: number;
  keywordDensity: KeywordDensity[];
  trendingSuggestions: string[];
  optimizationsMade: string[];
}

export interface SEOData {
  titles: TitleIdea[];
  thumbnailIdeas: string[];
  description: string;
  tags: string[];
  hashtags: string[];
  keywords: KeywordData;
  seoAnalysis: SEOAnalysis;
  aiThumbnailUrl?: string;
  aiThumbnailPrompt?: string;
}

export interface AdvancedOptions {
  language: "English" | "Hindi" | "Hinglish";
  contentType: "Tutorial" | "Gaming" | "Tech" | "Vlog" | "AI" | "Education" | "Shorts";
  titleTone: "Professional" | "Viral" | "Clickbait" | "Educational";
  descriptionLength: "Short" | "Medium" | "Long";
}

export interface SEOProject {
  id: string;
  overview: string;
  options: AdvancedOptions;
  createdAt: string;
  data: SEOData;
  isSaved: boolean;
  aiThumbnailUrl?: string;
  aiThumbnailPrompt?: string;
}
