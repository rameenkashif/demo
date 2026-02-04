import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import firebaseConfig from '../config/firebase.config';
import { createOrUpdateUser } from './supabase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add scopes for additional permissions if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);

        // Save user to Supabase database
        const supabaseResult = await createOrUpdateUser({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
        });

        if (!supabaseResult.success) {
            console.error('Failed to save user to Supabase:', supabaseResult.error);
        }

        return {
            success: true,
            user: {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL
            }
        };
    } catch (error) {
        console.error('Google sign-in error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

// Sign out
export const logOut = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
};

// Auth state observer
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
        } else {
            callback(null);
        }
    });
};

// Helper to get user-friendly error messages
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/popup-closed-by-user':
            return 'Sign-in cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Popup was blocked. Please allow popups for this site.';
        case 'auth/cancelled-popup-request':
            return 'Sign-in cancelled.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized. Please contact support.';
        default:
            return 'Sign-in failed. Please try again.';
    }
};

export { auth };
