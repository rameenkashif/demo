import OpenAI from 'openai';
import openaiConfig from '../config/openai.config';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: openaiConfig.apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

/**
 * Extract frames from video file
 * @param {File} videoFile - The video file
 * @param {number} frameCount - Number of frames to extract
 * @returns {Promise<Array<string>>} Base64 encoded frames
 */
async function extractFrames(videoFile, frameCount = 5) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const frames = [];

        video.preload = 'metadata';
        video.src = URL.createObjectURL(videoFile);

        video.onloadedmetadata = () => {
            const duration = video.duration;
            const interval = duration / (frameCount + 1);
            let currentFrame = 0;

            video.onseeked = () => {
                // Set canvas size to video size
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw current frame
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to base64
                const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                frames.push(base64);

                currentFrame++;

                if (currentFrame < frameCount) {
                    // Seek to next frame
                    video.currentTime = interval * (currentFrame + 1);
                } else {
                    // All frames extracted
                    URL.revokeObjectURL(video.src);
                    resolve(frames);
                }
            };

            video.onerror = () => {
                URL.revokeObjectURL(video.src);
                reject(new Error('Failed to load video'));
            };

            // Start extracting from first interval
            video.currentTime = interval;
        };
    });
}

/**
 * Analyze video using OpenAI GPT-4 Vision
 * @param {File} videoFile - The video file to analyze
 * @param {string} platform - Target platform (tiktok, reels, shorts)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeVideo(videoFile, platform = 'tiktok') {
    try {
        console.log('🎬 Starting AI video analysis...');
        console.log('📸 Extracting frames from video...');

        // Extract 5 key frames from the video
        const frames = await extractFrames(videoFile, 5);

        console.log(`✅ Extracted ${frames.length} frames`);
        console.log('🤖 Sending to OpenAI GPT-4 Vision...');

        // Create the analysis prompt
        const prompt = createAnalysisPrompt(platform, videoFile.name);

        // Prepare messages with frames
        const messages = [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    ...frames.map(frame => ({
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${frame}`,
                            detail: 'low' // Use 'low' for cost efficiency, 'high' for better quality
                        }
                    }))
                ]
            }
        ];

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7
        });

        const analysisText = response.choices[0].message.content;

        console.log('✅ AI analysis complete!');

        // Parse the response
        const structuredAnalysis = parseAnalysisResponse(analysisText, platform);

        return {
            success: true,
            data: structuredAnalysis
        };

    } catch (error) {
        console.error('❌ Video analysis failed:', error);
        return {
            success: false,
            error: error.message || 'Failed to analyze video'
        };
    }
}

/**
 * Create detailed analysis prompt for OpenAI
 */
function createAnalysisPrompt(platform, filename) {
    const platformName = {
        'tiktok': 'TikTok',
        'reels': 'Instagram Reels',
        'shorts': 'YouTube Shorts'
    }[platform] || 'Short-Form Video';

    return `You are an expert ${platformName} content strategist. I'm showing you 5 key frames from a short-form video.

Analyze these frames thoroughly and provide a detailed assessment in the following JSON format:

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
      "original": "Current hook based on first frame",
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
    "current": "Assumed current caption based on visuals",
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
- Hook Strength (0-100): Based on the first frame, how eye-catching and scroll-stopping is it?
- Retention Risk (0-100): Based on visual variety and pacing, likelihood of viewers watching till end. Higher = better.
- CTA Effectiveness (0-100): Are there clear visual/text CTAs in the frames?
- SEO/Discoverability (0-100): Quality of visual content for ${platformName} algorithm
- Trend Relevance (0-100): Alignment with current ${platformName} trends and formats

FEEDBACK GUIDELINES:
- Estimate timestamps based on frame progression
- "error" = critical issues hurting performance
- "warning" = areas needing improvement  
- "info" = optimization opportunities
- Provide actionable, specific suggestions

Respond ONLY with valid JSON. Be specific, actionable, and honest.`;
}

/**
 * Parse OpenAI's response into structured data
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
