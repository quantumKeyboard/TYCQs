import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin with service account
// You need to download your service account key from Firebase Console
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();

// Function to set admin claim
export async function setAdminClaim(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { isAdmin: true });
    return { success: true };
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return { success: false, error };
  }
}

// Function to remove admin claim
export async function removeAdminClaim(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { isAdmin: false });
    return { success: true };
  } catch (error) {
    console.error('Error removing admin claim:', error);
    return { success: false, error };
  }
} 