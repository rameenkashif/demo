// Mock analysis data for demo purposes
export const mockAnalysisResults = {
    videoTitle: "5 Morning Habits That Changed My Life",
    platform: "tiktok",
    duration: "00:47",

    scores: {
        hookStrength: 78,
        retentionRisk: 45,
        ctaEffectiveness: 62,
        seoDiscoverability: 85,
        trendRelevance: 71
    },

    timestampedFeedback: [
        {
            time: "0:00 - 0:03",
            type: "hook",
            severity: "warning",
            title: "Weak Hook Start",
            feedback: "Opening with \"Hey guys\" is overused. Try starting with an unexpected fact or question.",
            suggestion: "Replace with: \"I woke up at 3AM for 30 days. Here's what happened.\""
        },
        {
            time: "0:08 - 0:12",
            type: "pacing",
            severity: "info",
            title: "Good Pattern Interrupt",
            feedback: "Nice visual transition here. Keeps viewers engaged.",
            suggestion: null
        },
        {
            time: "0:15 - 0:22",
            type: "retention",
            severity: "warning",
            title: "Potential Drop-Off",
            feedback: "This section drags without new visual stimulus. Add B-roll or text overlay.",
            suggestion: "Add 2-3 quick cuts or overlay key points as text"
        },
        {
            time: "0:35 - 0:40",
            type: "cta",
            severity: "error",
            title: "Missing Mid-Video CTA",
            feedback: "Good opportunity for engagement prompt here before the finale.",
            suggestion: "Add: \"Which of these do you already do? Comment below!\""
        },
        {
            time: "0:44 - 0:47",
            type: "cta",
            severity: "warning",
            title: "Weak Ending CTA",
            feedback: "\"Follow for more\" is generic. Make it specific to content value.",
            suggestion: "Try: \"Follow for daily habits that actually work\""
        }
    ],

    hookSuggestions: [
        {
            style: "curiosity",
            text: "The habit I'm about to share saved my mornings (and it takes 30 seconds)",
            confidence: 92
        },
        {
            style: "shock",
            text: "I was doing mornings completely wrong for 10 years",
            confidence: 88
        },
        {
            style: "relatable",
            text: "Raise your hand if you've ever hit snooze 5 times 🙋‍♀️",
            confidence: 85
        },
        {
            style: "authority",
            text: "After coaching 200+ creators, here's the #1 morning mistake",
            confidence: 81
        },
        {
            style: "question",
            text: "What if I told you your morning alarm is ruining your day?",
            confidence: 79
        }
    ],

    ctaSuggestions: [
        {
            placement: "mid",
            text: "Drop a ☀️ if you're trying this tomorrow!",
            purpose: "engagement"
        },
        {
            placement: "end",
            text: "Save this for tomorrow morning ⏰",
            purpose: "saves"
        },
        {
            placement: "end",
            text: "Follow for habits that actually stick 💪",
            purpose: "follows"
        }
    ],

    captionSuggestions: {
        original: "5 morning habits that changed my life! Which one are you trying? #morningroutine #habits #productivity",
        optimized: "5 morning habits I wish I knew at 20 (save this 📌)\n\nThe 3rd one is a game-changer.\n\n#morningroutine #productivityhacks #habitsforlife #selfimprovement #mindset",
        keywords: ["morning routine", "productivity hacks", "habits", "self improvement", "mindset"]
    },

    hashtagClusters: [
        {
            name: "Primary",
            tags: ["#morningroutine", "#productivityhacks", "#habitsforlife"],
            reach: "high"
        },
        {
            name: "Secondary",
            tags: ["#selfimprovement", "#mindset", "#growthmindset"],
            reach: "medium"
        },
        {
            name: "Niche",
            tags: ["#5amclub", "#morningmotivation", "#dailyhabits"],
            reach: "targeted"
        }
    ]
}

export const scoreDescriptions = {
    hookStrength: "How well your opening captures attention in the first 3 seconds",
    retentionRisk: "Lower is better. Measures likelihood of viewer drop-off",
    ctaEffectiveness: "Strength of calls-to-action for engagement and follows",
    seoDiscoverability: "How easily your content can be found via search",
    trendRelevance: "Alignment with current trending formats and sounds"
}

export const scoreIcons = {
    hookStrength: "🎣",
    retentionRisk: "📉",
    ctaEffectiveness: "🎯",
    seoDiscoverability: "🔍",
    trendRelevance: "📈"
}
