// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eikyqsjnfydjikhugnjj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3lxc2puZnlkamlraHVnbmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTE4ODIsImV4cCI6MjA4ODU2Nzg4Mn0.LRNg8nsj-I48i4JHtOITb52WFk5dgV3m8ndBK-A7fFA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserCategory = 'visiteur' | 'participant' | 'exposant' | 'vip_b2b' | 'admin'

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  organization: string
  email: string
  phone: string
  category: UserCategory
  domain: string
  logo_url?: string
  badge_number: string
  qr_code: string
  verified: boolean
  created_at: string
}

export interface PanelReservation {
  id: string
  user_id: string
  panel_id: string
  status: 'confirmed' | 'waitlist' | 'cancelled'
  created_at: string
}

export interface B2BMeeting {
  id: string
  requester_id: string
  target_id: string
  date: string
  time: string
  duration: number
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}