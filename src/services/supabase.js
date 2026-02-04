import { createClient } from '@supabase/supabase-js';
import supabaseConfig from '../config/supabase.config';

// Initialize Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Create or update user in database
export const createOrUpdateUser = async (firebaseUser) => {
    try {
        const userData = {
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName,
            photo_url: firebaseUser.photoURL,
            last_login: new Date().toISOString()
        };

        // Upsert user (insert or update if exists)
        const { data, error } = await supabase
            .from('users')
            .upsert(userData, {
                onConflict: 'firebase_uid',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) throw error;

        // Log login activity
        await logUserActivity(data.id, 'login', {
            method: 'google_oauth',
            timestamp: new Date().toISOString()
        });

        return { success: true, user: data };
    } catch (error) {
        console.error('Error creating/updating user:', error);
        return { success: false, error: error.message };
    }
};

// Get user by Firebase UID
export const getUserByFirebaseUid = async (firebaseUid) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebaseUid)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return { success: true, user: data };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
};

// Save video analysis
export const saveVideoAnalysis = async (userId, analysisData) => {
    try {
        const { data, error } = await supabase
            .from('video_analyses')
            .insert({
                user_id: userId,
                ...analysisData
            })
            .select()
            .single();

        if (error) throw error;

        // Increment user's video count
        await supabase
            .from('users')
            .update({ videos_analyzed: supabase.rpc('increment', { row_id: userId }) })
            .eq('id', userId);

        return { success: true, analysis: data };
    } catch (error) {
        console.error('Error saving analysis:', error);
        return { success: false, error: error.message };
    }
};

// Get user's video analyses
export const getUserAnalyses = async (userId, limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('video_analyses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, analyses: data };
    } catch (error) {
        console.error('Error fetching analyses:', error);
        return { success: false, error: error.message };
    }
};

// Log user activity
export const logUserActivity = async (userId, activityType, metadata = {}) => {
    try {
        const { error } = await supabase
            .from('user_activity')
            .insert({
                user_id: userId,
                activity_type: activityType,
                metadata
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error logging activity:', error);
        return { success: false, error: error.message };
    }
};

// Get user stats
export const getUserStats = async (userId) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('videos_analyzed, created_at, plan')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        const { count: totalAnalyses } = await supabase
            .from('video_analyses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        const { data: recentAnalyses } = await supabase
            .from('video_analyses')
            .select('hook_strength, retention_risk, cta_effectiveness, seo_discoverability, trend_relevance')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        // Calculate average scores
        const averageScores = recentAnalyses && recentAnalyses.length > 0
            ? {
                hookStrength: Math.round(recentAnalyses.reduce((sum, a) => sum + a.hook_strength, 0) / recentAnalyses.length),
                retentionRisk: Math.round(recentAnalyses.reduce((sum, a) => sum + a.retention_risk, 0) / recentAnalyses.length),
                ctaEffectiveness: Math.round(recentAnalyses.reduce((sum, a) => sum + a.cta_effectiveness, 0) / recentAnalyses.length),
                seoDiscoverability: Math.round(recentAnalyses.reduce((sum, a) => sum + a.seo_discoverability, 0) / recentAnalyses.length),
                trendRelevance: Math.round(recentAnalyses.reduce((sum, a) => sum + a.trend_relevance, 0) / recentAnalyses.length),
            }
            : null;

        return {
            success: true,
            stats: {
                totalAnalyses: totalAnalyses || 0,
                plan: user.plan,
                memberSince: user.created_at,
                averageScores
            }
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { success: false, error: error.message };
    }
};

export { supabase };
