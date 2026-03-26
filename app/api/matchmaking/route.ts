import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eikyqsjnfydjikhugnjj.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

const DOMAIN_LABELS: Record<string, { fr: string; en: string }> = {
  'sante': { fr: 'Santé', en: 'Health' },
  'education': { fr: 'Éducation', en: 'Education' },
  'nutrition': { fr: 'Nutrition', en: 'Nutrition' },
  'eau': { fr: 'Eau et Assainissement', en: 'Water & Sanitation' },
  'protection': { fr: 'Protection de l\'enfance', en: 'Child Protection' },
  'genre': { fr: 'Genre et Inclusion', en: 'Gender & Inclusion' },
  'climat': { fr: 'Résilience Climatique', en: 'Climate Resilience' },
  'securite-alimentaire': { fr: 'Sécurité Alimentaire', en: 'Food Security' },
  'financement': { fr: 'Financement', en: 'Funding' },
  'technologie': { fr: 'Technologie', en: 'Technology' },
  'coordination': { fr: 'Coordination Humanitaire', en: 'Humanitarian Coordination' },
  'economie': { fr: 'Développement Économique', en: 'Economic Development' },
  'environnement': { fr: 'Environnement', en: 'Environment' },
}

interface MatchResult {
  user_id: string
  full_name: string
  organization: string
  category: string
  domains: string[]
  looking_for: string | null
  offering: string | null
  match_score: number
  shared_domains: string[]
  badge_number: string | null
}

function calculateMatchScore(userDomains: string[], otherDomains: string[]): { score: number; shared: string[] } {
  if (!userDomains || userDomains.length === 0 || !otherDomains || otherDomains.length === 0) {
    return { score: 0, shared: [] }
  }

  const userDomainSet = new Set(userDomains.map(d => d.toLowerCase()))
  const otherDomainSet = new Set(otherDomains.map(d => d.toLowerCase()))
  
  const shared = userDomains.filter(d => otherDomainSet.has(d.toLowerCase()))
  
  if (shared.length === 0) {
    return { score: 0, shared: [] }
  }

  const score = Math.min(shared.length * 0.4, 1)
  return { score, shared }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const domain = searchParams.get('domain')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { data: currentUser, error: userError } = await supabase
      .from('user_profiles')
      .select('domains, looking_for, category')
      .eq('user_id', userId)
      .single()

    if (userError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let query = supabase
      .from('user_profiles')
      .select('user_id, full_name, organization, category, domains, looking_for, offering, badge_number')
      .neq('user_id', userId)
      .eq('verified', true)
      .not('category', 'eq', 'visiteur')
      .limit(100)

    if (domain) {
      query = query.contains('domains', [domain])
    }

    const { data: allUsers, error: usersError } = await query

    if (usersError) {
      console.error('Matchmaking error:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    const currentUserDomains = currentUser.domains || []

    const matches: MatchResult[] = allUsers
      .map(otherUser => {
        const otherDomains = otherUser.domains || []
        const { score, shared } = calculateMatchScore(currentUserDomains, otherDomains)
        
        return {
          user_id: otherUser.user_id,
          full_name: otherUser.full_name,
          organization: otherUser.organization,
          category: otherUser.category,
          domains: otherDomains,
          looking_for: otherUser.looking_for,
          offering: otherUser.offering,
          match_score: score,
          shared_domains: shared,
          badge_number: otherUser.badge_number
        }
      })
      .filter(m => m.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit)

    return NextResponse.json({
      matches,
      total: matches.length,
      userDomains: currentUserDomains
    })
  } catch (error: any) {
    console.error('Matchmaking API error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, targetUserId, meetingDate, meetingTime, message } = body

    switch (action) {
      case 'request_meeting': {
        if (!userId || !targetUserId || !meetingDate || !meetingTime) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('meeting_requests')
          .insert({
            requester_id: userId,
            target_id: targetUserId,
            meeting_date: meetingDate,
            meeting_time: meetingTime,
            message: message || null,
            status: 'pending'
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            return NextResponse.json({ error: 'Ce créneau est déjà réservé' }, { status: 409 })
          }
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, meetingRequest: data })
      }

      case 'respond_meeting': {
        const { requestId, accept } = body
        if (!requestId || !userId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('meeting_requests')
          .update({ 
            status: accept ? 'accepted' : 'declined',
            updated_at: new Date().toISOString()
          })
          .eq('id', requestId)
          .eq('target_id', userId)
          .select()
          .single()

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, meetingRequest: data })
      }

      case 'cancel_meeting': {
        const { requestId } = body
        if (!requestId || !userId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { error } = await supabase
          .from('meeting_requests')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('id', requestId)
          .eq('requester_id', userId)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Matchmaking POST error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
