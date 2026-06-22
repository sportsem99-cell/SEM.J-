'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProfile(data: {
  name: string; phone: string; birth_date: string; gender: string
  height_cm: number | null; weight_kg: number | null; experience: string
  allergy: boolean; allergy_desc: string; condition: boolean; condition_desc: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name: data.name || null,
      phone: data.phone || null,
      birth_date: data.birth_date || null,
      gender: data.gender || null,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      experience: data.experience || null,
      allergy: data.allergy,
      allergy_desc: data.allergy_desc || null,
      condition: data.condition,
      condition_desc: data.condition_desc || null,
    })

  if (error) return { error: error.message }
  revalidatePath('/my/profile')
  return { ok: true }
}
