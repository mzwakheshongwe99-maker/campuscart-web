import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfgogxhnxpkcayzmltti.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oILtrwrmY0IIiqv1SIqQ8Q_uBkJDS4k'
  );
}
