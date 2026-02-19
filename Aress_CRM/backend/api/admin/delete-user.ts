import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Verify the request is from an authenticated admin
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    // Verify the token and check if user is admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.split('Bearer ')[1]
    );

    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // Check if user is admin
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can delete users' });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // Delete the auth user using admin API
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      return res.status(400).json({ success: false, error: deleteError.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
