import { notFound } from 'next/navigation'
import Header from '@/components/features/Header'
import BookingWizard from '@/components/features/BookingWizard'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBlockedDates } from '@/app/actions/slots'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function BookingPage({ params }: { params: { programType: string } }) {
  const slug = params.programType
  const adminSupabase = createAdminClient()

  // UUID이면 id로 조회, 슬러그이면 type으로 조회
  const query = adminSupabase
    .from('programs')
    .select('id, name, price, local_price, capacity, duration_min, is_active')
    .eq('org_id', ORG_ID)

  const { data: dbProgram } = await (
    UUID_RE.test(slug)
      ? query.eq('id', slug).single()
      : query.eq('type', slug).single()
  )

  if (!dbProgram || !dbProgram.is_active) notFound()

  const program = {
    name:       dbProgram.name,
    price:      dbProgram.price ?? 0,
    localPrice: dbProgram.local_price ?? dbProgram.price ?? 0,
    capacity:   dbProgram.capacity ?? 1,
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let savedProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('name, phone, birth_date, gender, height_cm, weight_kg, experience, allergy, allergy_desc, condition, condition_desc')
      .eq('id', user.id)
      .single()
    savedProfile = data
  }

  const blockedDates = await getBlockedDates()

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm text-brand-green-600 font-semibold mb-1">예약</p>
          <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="text-brand-green-700 font-bold text-lg">
              {program.price.toLocaleString()}원
            </p>
            {program.localPrice !== program.price && (
              <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2.5 py-1 rounded-full">
                군민 {program.localPrice.toLocaleString()}원
              </span>
            )}
          </div>
        </div>

        <BookingWizard
          programId={dbProgram.id}
          program={program}
          savedProfile={savedProfile}
          blockedDates={blockedDates}
        />
      </div>
    </>
  )
}
