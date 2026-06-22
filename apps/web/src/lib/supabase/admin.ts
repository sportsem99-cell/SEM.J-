import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 서비스 롤 키 사용 - RLS 우회, 서버사이드 전용
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
