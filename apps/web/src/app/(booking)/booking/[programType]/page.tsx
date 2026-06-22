import Header from '@/components/features/Header'
import BookingWizard from '@/components/features/BookingWizard'
import { createClient } from '@/lib/supabase/server'

const PROGRAM_INFO: Record<string, { name: string; price: number; capacity: number }> = {
  experience: { name: '체험승마',       price: 30000, capacity: 6 },
  private:    { name: '개인레슨',       price: 60000, capacity: 1 },
  group:      { name: '그룹레슨',       price: 40000, capacity: 6 },
  youth:      { name: '유소년 프로그램', price: 35000, capacity: 6 },
}

export default async function BookingPage({ params }: { params: { programType: string } }) {
  const program = PROGRAM_INFO[params.programType]

  if (!program) {
    return <div className="p-10 text-center text-gray-500">존재하지 않는 프로그램입니다.</div>
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

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm text-brand-green-600 font-semibold mb-1">예약</p>
          <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
          <p className="text-brand-green-700 font-bold text-lg mt-1">
            {program.price.toLocaleString()}원 / 1회 (60분)
          </p>
        </div>

        <BookingWizard programType={program.name} program={program} savedProfile={savedProfile} />
      </div>
    </>
  )
}
