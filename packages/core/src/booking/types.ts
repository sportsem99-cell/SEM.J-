export type ProgramType = 'experience' | 'private' | 'group' | 'youth'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type ResourceType = 'instructor' | 'horse' | 'arena'

export interface TimeSlot {
  startAt: Date
  endAt: Date
}

export interface BookingRequest {
  programId: string
  userId: string
  startAt: Date
  participants: Participant[]
}

export interface Participant {
  name: string
  birthDate?: Date
  phone?: string
  isAccountHolder: boolean
}

export interface PriceBreakdown {
  basePrice: number
  discountAmount: number
  voucherAmount: number
  totalAmount: number
}
