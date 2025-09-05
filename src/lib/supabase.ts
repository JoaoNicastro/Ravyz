import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========================================
// TypeScript Types for Database
// ========================================

export interface UserProfile {
  id: string
  email: string
  document: string
  user_type: 'candidate' | 'company'
  status: 'active' | 'inactive' | 'suspended'
  email_verified: boolean
  linkedin_connected: boolean
  linkedin_data: any
  registration_source?: string
  utm_source?: string
  utm_campaign?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface CandidateProfile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  location_city?: string
  location_state?: string
  location_country: string
  birth_date?: string
  selected_mentor: any
  profile_completion_percentage: number
  is_profile_public: boolean
  is_seeking_job: boolean
  created_at: string
  updated_at: string
}

export interface CompanyProfile {
  id: string
  user_id: string
  company_name: string
  cnpj: string
  industry?: string
  company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  founded_year?: number
  website?: string
  description?: string
  headquarters_city?: string
  headquarters_state?: string
  headquarters_country: string
  contact_person_name?: string
  contact_person_role?: string
  contact_phone?: string
  is_profile_public: boolean
  is_hiring: boolean
  created_at: string
  updated_at: string
}

export interface ProfessionalAssessment {
  id: string
  candidate_id: string
  primary_profile: string
  secondary_profile: string
  profile_type: 'leadership' | 'communication' | 'analytical' | 'creative' | 'execution'
  leadership_score: number
  communication_score: number
  analytical_score: number
  creative_score: number
  execution_score: number
  overall_score: number
  percentile: number
  assessment_duration_minutes: number
  questions_answered: number
  detailed_results: any
  strengths: string[]
  development_areas: string[]
  completed_at: string
  created_at: string
}

export interface DreamJob {
  id: string
  candidate_id: string
  position: string
  seniority_level: 'estagiario' | 'junior' | 'pleno' | 'senior' | 'especialista' | 'lider' | 'diretor'
  work_format: 'presencial' | 'remoto' | 'hibrido'
  contract_type: 'clt' | 'pj' | 'estagio' | 'freelancer'
  salary_min?: number
  salary_max?: number
  salary_currency: string
  preferred_company_sizes: string[]
  preferred_industries: string[]
  preferred_locations: any[]
  open_to_relocation: boolean
  availability_start_date?: string
  notice_period_days: number
  matching_flags: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  description?: string
  seniority_level: 'estagiario' | 'junior' | 'pleno' | 'senior' | 'especialista' | 'lider' | 'diretor'
  work_format: 'presencial' | 'remoto' | 'hibrido'
  contract_type: 'clt' | 'pj' | 'estagio' | 'freelancer'
  job_location_city?: string
  job_location_state?: string
  job_location_country: string
  salary_min?: number
  salary_max?: number
  salary_currency: string
  salary_show_range: boolean
  requirements: any[]
  benefits: any[]
  matching_flags: any
  target_profile_flags: any
  status: 'draft' | 'active' | 'paused' | 'filled' | 'cancelled'
  applications_count: number
  views_count: number
  expires_at?: string
  filled_at?: string
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  candidate_id: string
  job_id: string
  company_id: string
  compatibility_score: number
  compatibility_breakdown: any
  profile_match_score?: number
  salary_match_score?: number
  location_match_score?: number
  work_format_match_score?: number
  status: 'pending' | 'candidate_liked' | 'company_liked' | 'mutual_match' | 'candidate_passed' | 'company_passed'
  candidate_action?: 'like' | 'pass' | 'super_like'
  candidate_action_at?: string
  company_action?: 'like' | 'pass' | 'super_like'
  company_action_at?: string
  conversation_started: boolean
  last_message_at?: string
  created_at: string
  updated_at: string
}

export interface FeedbackRating {
  id: string
  rater_id: string
  rated_id: string
  match_id: string
  feedback_type: 'interview_feedback' | 'hire_feedback' | 'process_feedback'
  communication_rating?: number
  technical_rating?: number
  cultural_fit_rating?: number
  professionalism_rating?: number
  overall_rating: number
  positive_feedback?: string
  improvement_feedback?: string
  additional_comments?: string
  would_recommend?: boolean
  would_work_again?: boolean
  is_public: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

// ========================================
// Database Helper Functions
// ========================================

// User Profile Functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  
  return { data, error }
}

// Candidate Profile Functions
export const getCandidateProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createCandidateProfile = async (profile: Omit<CandidateProfile, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .insert(profile)
    .select()
    .single()
  
  return { data, error }
}

export const updateCandidateProfile = async (candidateId: string, updates: Partial<CandidateProfile>) => {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .update(updates)
    .eq('id', candidateId)
    .select()
  
  return { data, error }
}

// Company Profile Functions
export const getCompanyProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createCompanyProfile = async (profile: Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('company_profiles')
    .insert(profile)
    .select()
    .single()
  
  return { data, error }
}

// Professional Assessment Functions
export const saveProfessionalAssessment = async (assessment: Omit<ProfessionalAssessment, 'id' | 'completed_at' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('professional_assessments')
    .insert(assessment)
    .select()
    .single()
  
  return { data, error }
}

export const getProfessionalAssessment = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('professional_assessments')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  return { data, error }
}

// Dream Job Functions
export const saveDreamJob = async (dreamJob: Omit<DreamJob, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('dream_jobs')
    .upsert(dreamJob, { onConflict: 'candidate_id' })
    .select()
    .single()
  
  return { data, error }
}

export const getDreamJob = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('dream_jobs')
    .select('*')
    .eq('candidate_id', candidateId)
    .eq('is_active', true)
    .single()
  
  return { data, error }
}

// Job Functions
export const createJob = async (job: Omit<Job, 'id' | 'applications_count' | 'views_count' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single()
  
  return { data, error }
}

export const getActiveJobs = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('jobs_with_company')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  return { data, error }
}

export const getCompanyJobs = async (companyId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Match Functions
export const createMatch = async (match: Omit<Match, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('matches')
    .insert(match)
    .select()
    .single()
  
  return { data, error }
}

export const getCandidateMatches = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      jobs:job_id(title, company_id, salary_min, salary_max),
      company_profiles:company_id(company_name, industry)
    `)
    .eq('candidate_id', candidateId)
    .order('compatibility_score', { ascending: false })
  
  return { data, error }
}

export const getCompanyMatches = async (companyId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      candidate_profiles:candidate_id(full_name, location_city, location_state),
      professional_assessments:candidate_id(primary_profile, overall_score)
    `)
    .eq('company_id', companyId)
    .order('compatibility_score', { ascending: false })
  
  return { data, error }
}

export const updateMatchAction = async (
  matchId: string, 
  action: 'like' | 'pass' | 'super_like',
  userType: 'candidate' | 'company'
) => {
  const updates = userType === 'candidate' 
    ? { 
        candidate_action: action, 
        candidate_action_at: new Date().toISOString() 
      }
    : { 
        company_action: action, 
        company_action_at: new Date().toISOString() 
      }
  
  const { data, error } = await supabase
    .from('matches')
    .update(updates)
    .eq('id', matchId)
    .select()
    .single()
  
  return { data, error }
}

// Feedback Functions
export const createFeedback = async (feedback: Omit<FeedbackRating, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('feedback_ratings')
    .insert(feedback)
    .select()
    .single()
  
  return { data, error }
}

export const getUserFeedbacks = async (userId: string) => {
  const { data, error } = await supabase
    .from('feedback_ratings')
    .select('*')
    .eq('rated_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Analytics Functions
export const getUserAnalytics = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_analytics')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const incrementProfileView = async (userId: string) => {
  const { error } = await supabase.rpc('increment_profile_views', { user_id: userId })
  return { error }
}

// Salary Data Functions
export const getSalaryBenchmark = async (
  position: string, 
  seniority: string, 
  city?: string, 
  state?: string
) => {
  let query = supabase
    .from('salary_data')
    .select('*')
    .ilike('position_title', `%${position}%`)
    .eq('seniority_level', seniority)
  
  if (city) query = query.eq('city', city)
  if (state) query = query.eq('state', state)
  
  const { data, error } = await query
    .order('sample_size', { ascending: false })
    .limit(10)
  
  return { data, error }
}

// Skills Functions
export const searchSkills = async (query: string, limit = 10) => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit)
  
  return { data, error }
}

export const getCandidateSkills = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('candidate_skills')
    .select(`
      *,
      skills:skill_id(name, category)
    `)
    .eq('candidate_id', candidateId)
  
  return { data, error }
}

// Real-time subscriptions
export const subscribeToMatches = (candidateId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('matches')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `candidate_id=eq.${candidateId}`
      },
      callback
    )
    .subscribe()
}

export const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      callback
    )
    .subscribe()
}

// Authentication helpers
export const signUp = async (email: string, password: string, userData: { user_type: string, document: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Utility function to convert salary from cents to real
export const formatSalary = (cents: number | null | undefined): string => {
  if (!cents) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

// Utility function to convert real to cents for storage
export const salaryToCents = (value: number): number => {
  return Math.round(value * 100)
}