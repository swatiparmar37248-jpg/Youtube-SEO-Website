import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit to handle larger inputs
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// SEO Generation API endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { videoOverview, language, contentType, titleTone, descriptionLength } = req.body;

    if (!videoOverview || typeof videoOverview !== "string" || videoOverview.trim() === "") {
      return res.status(400).json({ error: "Video overview is required." });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is not configured. Please set the GEMINI_API_KEY in the Secrets panel.",
      });
    }

    const languageStr = language || "English";
    const contentTypeStr = contentType || "General";
    const titleToneStr = titleTone || "Viral";
    const descriptionLengthStr = descriptionLength || "Medium";

    // Build the instruction and prompt
    const systemInstruction = `You are an elite YouTube SEO expert, viral strategist, and professional copywriter similar to a combined intelligence of TubeBuddy, VidIQ, and veteran content creators.
Your task is to analyze the video overview provided by the user and generate high-performing, YouTube SEO-optimized, CTR-boosting, and search-friendly metadata.

You must reply with a valid JSON object matching the requested schema. Ensure the response strictly follows the language selected: ${languageStr}.
If Hinglish or Hindi is selected, the titles, thumbnail text, description, tags, hashtags, and keywords should be generated in that language/style. Hinglish means Hindi written in Latin alphabet.
The Content Type is: ${contentTypeStr}.
The requested Title Tone is: ${titleToneStr}.
The requested Description Length is: ${descriptionLengthStr}.`;

    const userPrompt = `Generate YouTube SEO assets for this video overview:
"${videoOverview}"

Generate:
1. 10 Clickable YouTube Titles styled with tone "${titleToneStr}". Give a mix of Curiosity, Professional, Tutorial, and Viral styles. Keep them under 100 characters.
2. 10 Thumbnail Text Ideas (short, bold, high CTR, 2-5 words).
3. A complete and beautifully formatted YouTube Description (length: ${descriptionLengthStr}). It should contain a captivating hook, a comprehensive summary, timeline placeholders, Call to Action, disclaimer placeholders, and social media placeholders.
4. 30 to 50 highly relevant Tags, provided as individual strings in an array.
5. 15 to 20 trending and relevant Hashtags (without the '#' symbol, just the words, to be safe and clean).
6. Target Keywords: 1 primary main keyword, 5-10 secondary keywords, and 5-10 long-tail keywords.
7. SEO & Viral Analysis: An SEO Score (0-100), a Viral Score (0-100), keyword density analysis (for the top 5 keywords, with estimated percentages of usage), 5 trending keyword suggestions, and 3 specific optimizations made.`;

    const config = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            description: "10 high-CTR, click-worthy, SEO-optimized YouTube titles",
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "The title text. Keep it under 100 characters." },
                style: { type: Type.STRING, description: "Style of the title (e.g. Curiosity, Professional, Tutorial, Viral, Hook)" },
                ctrExplanation: { type: Type.STRING, description: "One sentence explanation of why this title drives high CTR." }
              },
              required: ["text", "style", "ctrExplanation"]
            }
          },
          thumbnailIdeas: {
            type: Type.ARRAY,
            description: "10 attention-grabbing text overlays for thumbnails. Short, punchy (2-5 words), and bold.",
            items: { type: Type.STRING }
          },
          description: {
            type: Type.STRING,
            description: "A comprehensive, beautifully structured SEO-optimized video description. Must include hook, summary, social media links placeholder, disclaimer placeholder, and clear calls to action."
          },
          tags: {
            type: Type.ARRAY,
            description: "30 to 50 highly relevant tags for YouTube keyword tagging.",
            items: { type: Type.STRING }
          },
          hashtags: {
            type: Type.ARRAY,
            description: "15 to 20 relevant hashtags for YouTube (without leading # symbol).",
            items: { type: Type.STRING }
          },
          keywords: {
            type: Type.OBJECT,
            properties: {
              mainKeyword: { type: Type.STRING, description: "The absolute primary target keyword" },
              secondaryKeywords: {
                type: Type.ARRAY,
                description: "5 to 10 secondary target keywords",
                items: { type: Type.STRING }
              },
              longTailKeywords: {
                type: Type.ARRAY,
                description: "5 to 10 long-tail keyword variations",
                items: { type: Type.STRING }
              }
            },
            required: ["mainKeyword", "secondaryKeywords", "longTailKeywords"]
          },
          seoAnalysis: {
            type: Type.OBJECT,
            properties: {
              seoScore: { type: Type.INTEGER, description: "SEO optimization score from 0 to 100" },
              viralScore: { type: Type.INTEGER, description: "Viral potential score from 0 to 100" },
              keywordDensity: {
                type: Type.ARRAY,
                description: "Keyword density analysis of top 5 keywords and their frequency/density",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    density: { type: Type.STRING, description: "e.g. '2.5%' or '4 times'" }
                  },
                  required: ["keyword", "density"]
                }
              },
              trendingSuggestions: {
                type: Type.ARRAY,
                description: "5 trending or breakout search term suggestions related to this topic",
                items: { type: Type.STRING }
              },
              optimizationsMade: {
                type: Type.ARRAY,
                description: "3 professional SEO optimizations applied to these outputs",
                items: { type: Type.STRING }
              }
            },
            required: ["seoScore", "viralScore", "keywordDensity", "trendingSuggestions", "optimizationsMade"]
          }
        },
        required: ["titles", "thumbnailIdeas", "description", "tags", "hashtags", "keywords", "seoAnalysis"]
      }
    };

    // Retry with exponential backoff & Fallback to gemini-3.1-flash-lite
    let response: any = null;
    let lastError: any = null;
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      const maxAttempts = modelName === "gemini-3.5-flash" ? 3 : 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`Calling Gemini API using model: ${modelName} (Attempt ${attempt}/${maxAttempts})...`);
          response = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config,
          });
          break; // successfully retrieved response, break attempt loop
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} attempt ${attempt} failed: ${err.message || err}`);
          if (attempt < maxAttempts) {
            const delay = 1000 * Math.pow(2, attempt - 1);
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      if (response) {
        console.log(`Successfully generated SEO assets using model: ${modelName}`);
        break; // break model loop
      }
    }

    if (!response) {
      throw lastError || new Error("All model fallback attempts failed.");
    }

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating SEO assets:", error);
    return res.status(500).json({
      error: "Failed to generate SEO assets. Please try again later.",
      details: error.message || error
    });
  }
});

// Helper to generate prompt using Gemini
const generateThumbnailPrompt = async (overview: string, contentType?: string): Promise<string> => {
  if (!ai) {
    return `A viral YouTube thumbnail background about: ${overview}. High contrast, professional studio lighting, relevant graphics, eye-catching.`;
  }
  try {
    const promptResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an expert designer for YouTube thumbnails.
Analyze this video overview and create an ultra-detailed, professional image generation prompt for the FLUX model.
The prompt should describe a high-contrast, visually arresting, extremely clickable thumbnail background scene.
Guidelines:
- Recommend relevant eye-catching graphics, characters, objects, professional studio lighting, depth of field, neon glow, and high-impact colors.
- DO NOT include text overlay instructions (like "add words" or "with text 'XYZ'") in the prompt because we will overlay text on top using our canvas renderer or let FLUX generate background without text.
- Make it highly vivid, cinematic, and viral.
- Keep the prompt description concise but extremely descriptive, about 2 to 4 sentences.

Video Overview: "${overview}"
Content Type: "${contentType || "General"}"

Output ONLY the generated FLUX prompt, no explanation or greeting.`,
    });
    return promptResponse.text?.trim() || `A viral YouTube thumbnail background about: ${overview}. High contrast, professional studio lighting, relevant graphics, eye-catching.`;
  } catch (err) {
    console.warn("Failed to generate prompt with Gemini, using fallback prompt.", err);
    return `A viral YouTube thumbnail background about: ${overview}. High contrast, professional studio lighting, relevant graphics, eye-catching.`;
  }
};

// Thumbnail Generation API endpoint using FLUX API
app.post("/api/generate-thumbnail", async (req, res) => {
  try {
    const { videoOverview, contentType } = req.body;

    if (!videoOverview || typeof videoOverview !== "string" || videoOverview.trim() === "") {
      return res.status(400).json({ error: "Video overview is required." });
    }

    const fluxApiKey = process.env.FLUX_API_KEY;
    if (!fluxApiKey || fluxApiKey.trim() === "" || fluxApiKey === "your_api_key") {
      return res.status(400).json({
        error: "FLUX_API_KEY is not configured. Please set the FLUX_API_KEY in your Secrets panel to use AI Thumbnail generation.",
      });
    }

    // 1. Generate professional FLUX prompt from overview
    console.log("Generating visual thumbnail prompt via Gemini...");
    const thumbnailPrompt = await generateThumbnailPrompt(videoOverview, contentType);
    console.log(`Generated FLUX prompt: "${thumbnailPrompt}"`);

    // 2. Submit task to FLUX API (api.bfl.ml)
    // We can try flux-pro-1.1 first, fallback to flux-pro or flux-dev
    let taskId = "";
    let submissionError: any = null;
    const fluxEndpoints = [
      "https://api.bfl.ml/v1/flux-pro-1.1",
      "https://api.bfl.ml/v1/flux-pro",
      "https://api.bfl.ml/v1/flux-dev"
    ];

    for (const endpoint of fluxEndpoints) {
      try {
        console.log(`Submitting image generation task to: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-key": fluxApiKey,
            "Authorization": `Bearer ${fluxApiKey}`
          },
          body: JSON.stringify({
            prompt: thumbnailPrompt,
            width: 1280,
            height: 720,
            prompt_upsampling: false,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        if (data && data.id) {
          taskId = data.id;
          console.log(`Successfully created FLUX task. Task ID: ${taskId}`);
          break;
        }
      } catch (err: any) {
        submissionError = err;
        console.warn(`Failed to submit to endpoint ${endpoint}:`, err.message || err);
      }
    }

    if (!taskId) {
      throw submissionError || new Error("Failed to initialize FLUX image generation task across all endpoints.");
    }

    // 3. Poll for result (GET https://api.bfl.ml/v1/get_result?id=<taskId>)
    const pollUrl = `https://api.bfl.ml/v1/get_result?id=${taskId}`;
    let imageUrl = "";
    let attempts = 0;
    const maxAttempts = 35; // 35 * 1.5s = ~52s max poll
    const pollInterval = 1500;

    console.log("Polling FLUX API for result...");
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const pollResponse = await fetch(pollUrl, {
          method: "GET",
          headers: {
            "x-key": fluxApiKey,
            "Authorization": `Bearer ${fluxApiKey}`
          },
        });

        if (!pollResponse.ok) {
          console.warn(`Poll attempt ${attempts} failed with HTTP ${pollResponse.status}`);
        } else {
          const pollData = await pollResponse.json();
          const status = pollData.status;
          console.log(`Poll attempt ${attempts}: status is "${status}"`);

          if (status === "Ready") {
            // Retrieve image URL from various potential response structures
            imageUrl = pollData.result?.sample || pollData.result?.url || pollData.result?.output || (pollData.result?.images && pollData.result.images[0]) || pollData.sample || pollData.url;
            if (imageUrl) {
              console.log(`FLUX Image successfully generated! URL: ${imageUrl}`);
              break;
            } else {
              console.error("FLUX response was marked Ready but no image URL was found:", pollData);
            }
          } else if (status === "Failed") {
            throw new Error(`FLUX generation task failed: ${pollData.error || "unknown failure reason"}`);
          }
        }
      } catch (err: any) {
        console.error("Error during poll attempt:", err.message || err);
        if (err.message && err.message.includes("failed")) {
          throw err;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    if (!imageUrl) {
      throw new Error("FLUX image generation timed out or failed to produce a valid image URL.");
    }

    // Return the response matching requirements
    return res.json({
      imageUrl,
      thumbnailPrompt
    });

  } catch (error: any) {
    console.error("Error generating thumbnail:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI thumbnail using FLUX API.",
    });
  }
});

// Serve static assets or mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
