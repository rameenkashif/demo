import { GoogleGenerativeAI } from "@google/generative-ai";
import geminiConfig from "../config/gemini.config";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

/**
 * Analyze video using Gemini AI
 * @param {File} videoFile - The video file to analyze
 * @param {string} platform - Target platform (tiktok, reels, shorts)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeVideo(videoFile, platform = 'tiktok') {
    try {
        console.log('🎬 Starting AI video analysis...');

        // Convert video file to base64
        const videoData = await fileToGenerativePart(videoFile);

        // Get the Gemini model (using Gemini Pro Vision for video analysis)
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        // Create comprehensive analysis prompt
        const prompt = createAnalysisPrompt(platform, videoFile.name);

        console.log('🤖 Sending to Gemini AI...');

        // Generate content with video + prompt
        const result = await model.generateContent([prompt, videoData]);
        const response = await result.response;
        const analysisText = response.text();

        console.log('✅ AI analysis complete!');

        // Parse the AI response into structured data
        const structuredAnalysis = parseAnalysisResponse(analysisText, platform);

        return {
            success: true,
            data: structuredAnalysis
        };

    } catch (error) {
        console.error('❌ Video analysis failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Convert File to base64 format required by Gemini
 */
async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Create detailed analysis prompt for Gemini
 */
function createAnalysisPrompt(platform, filename) {
    const platformName = {
        'tiktok': 'TikTok',
        'reels': 'Instagram Reels',
        'shorts': 'YouTube Shorts'
    }[platform] || 'Short-Form Video';

    return `You are an expert ${platformName} content strategist analyzing this video for performance optimization.

Analyze the video thoroughly and provide a detailed assessment in the following JSON format:

{
  "scores": {
    "hookStrength": <0-100>,
    "retentionRisk": <0-100>,
    "ctaEffectiveness": <0-100>,
    "seoDiscoverability": <0-100>,
    "trendRelevance": <0-100>
  },
  "feedback": [
    {
      "timestamp": "0:00-0:03",
      "severity": "error|warning|info",
      "message": "Specific feedback about this section",
      "suggestion": "Actionable improvement suggestion"
    }
  ],
  "hooks": [
    {
      "original": "Current hook text or description",
      "rewrite": "Improved hook suggestion",
      "style": "question|statement|shock|curiosity",
      "confidence": <0-100>
    }
  ],
  "ctas": [
    {
      "timing": "early|mid|end",
      "message": "Suggested CTA text",
      "effectiveness": <0-100>
    }
  ],
  "caption": {
    "current": "Detected or assumed current caption",
    "optimized": "SEO-optimized caption suggestion",
    "keywords": ["keyword1", "keyword2"],
    "hashtags": {
      "trending": ["#tag1", "#tag2"],
      "niche": ["#tag3", "#tag4"],
      "branded": ["#tag5"]
    }
  },
  "summary": "Brief overall assessment and key recommendations"
}

SCORING GUIDELINES:
- Hook Strength (0-100): How compelling are the first 3 seconds? Do they stop the scroll?
- Retention Risk (0-100): Likelihood viewers watch til the end. Higher = better retention.
- CTA Effectiveness (0-100): Are calls-to-action clear, timely, and persuasive?
- SEO/Discoverability (0-100): Caption quality, keyword usage, hashtag strategy
- Trend Relevance (0-100): Alignment with current ${platformName} trends

FEEDBACK GUIDELINES:
- Use timestamps to pinpoint specific moments
- "error" = critical issues hurting performance
- "warning" = areas needing improvement
- "info" = optimization opportunities
- Always include actionable suggestions

Be specific, actionable, and honest. The creator wants real insights to improve.`;
}

/**
 * Parse Gemini's text response into structured data
 */
function parseAnalysisResponse(responseText, platform) {
    try {
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);

            // Ensure all required fields exist with defaults
            return {
                videoTitle: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video Analysis`,
                platform: platform,
                scores: {
                    hookStrength: parsed.scores?.hookStrength || 0,
                    retentionRisk: parsed.scores?.retentionRisk || 0,
                    ctaEffectiveness: parsed.scores?.ctaEffectiveness || 0,
                    seoDiscoverability: parsed.scores?.seoDiscoverability || 0,
                    trendRelevance: parsed.scores?.trendRelevance || 0
                },
                feedback: parsed.feedback || [],
                hookSuggestions: parsed.hooks || [],
                ctaSuggestions: parsed.ctas || [],
                captionOptimization: parsed.caption || {
                    current: '',
                    optimized: '',
                    keywords: [],
                    hashtags: { trending: [], niche: [], branded: [] }
                },
                summary: parsed.summary || 'Analysis complete.',
                analyzedAt: new Date().toISOString()
            };
        }

        // Fallback if JSON parsing fails
        return createFallbackAnalysis(responseText, platform);

    } catch (error) {
        console.error('Failed to parse AI response:', error);
        return createFallbackAnalysis(responseText, platform);
    }
}

/**
 * Create fallback analysis if parsing fails
 */
function createFallbackAnalysis(rawText, platform) {
    return {
        videoTitle: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video Analysis`,
        platform: platform,
        scores: {
            hookStrength: 70,
            retentionRisk: 65,
            ctaEffectiveness: 60,
            seoDiscoverability: 55,
            trendRelevance: 70
        },
        feedback: [
            {
                timestamp: '0:00',
                severity: 'info',
                message: 'AI analysis completed',
                suggestion: rawText.substring(0, 200)
            }
        ],
        hookSuggestions: [],
        ctaSuggestions: [],
        captionOptimization: {
            current: '',
            optimized: rawText.substring(0, 150),
            keywords: [],
            hashtags: { trending: [], niche: [], branded: [] }
        },
        summary: 'Analysis complete. Review feedback for details.',
        analyzedAt: new Date().toISOString(),
        rawResponse: rawText
    };
}
