import { adminAuth, setAdminClaim } from '@/lib/firebase/admin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify the request is from an admin
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check if the requester is an admin
    if (!decodedToken.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'No uid provided' });
    }

    const result = await setAdminClaim(uid);
    if (result.success) {
      return res.status(200).json({ message: 'Admin claim set successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to set admin claim' });
    }
  } catch (error) {
    console.error('Error in setAdmin handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 