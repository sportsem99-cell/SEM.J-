'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export async function updateProgram(id: string, data: {
  price: number
  local_price: number
  duration_min: number
  capacity: number
  is_active: boolean
}) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('programs')
    .update({
      price:        data.price,
      local_price:  data.local_price,
      duration_min: data.duration_min,
      capacity:     data.capacity,
      is_active:    data.is_active,
    })
    .eq('id', id)
    .eq('org_id', ORG_ID)

  if (error) return { error: error.message }
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
  return { ok: true }
}

export async function createProgram(data: {
  name: string
  description: string
  price: number
  local_price: number
  duration_min: number
  capacity: number
}) {
  const supabase = createAdminClient()

  const slug = `custom_${Date.now()}`

  const { data: program, error } = await supabase
    .from('programs')
    .insert({
      org_id:       ORG_ID,
      name:         data.name,
      description:  data.description,
      type:         slug,
      base_price:   data.price,
      price:        data.price,
      local_price:  data.local_price,
      duration_min: data.duration_min,
      capacity:     data.capacity,
      is_active:    true,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
  return { ok: true, id: program?.id }
}

export async function deleteProgram(id: string) {
  const supabase = createAdminClient()

  // 진행 중인 예약 확인
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('program_id', id)
    .in('status', ['pending', 'confirmed', 'checked_in'])

  if (count && count > 0) {
    return { error: `진행 중인 예약이 ${count}건 있어 삭제할 수 없습니다.` }
  }

  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)
    .eq('org_id', ORG_ID)

  if (error) return { error: error.message }
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
  return { ok: true }
}
