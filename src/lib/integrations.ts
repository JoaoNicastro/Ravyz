// ========================================
// Integration Layer - Combines Supabase + n8n
// ========================================

import { 
  saveProfessionalAssessment, 
  createCandidateProfile, 
  saveDreamJob,
  createJob,
  createMatch
} from './supabase';
import { 
  triggerCandidateAnalysis, 
  processAIConversationInsights,
  triggerJobMatching,
  sendWelcomeEmail,
  notifyCompanyNewCandidates 
} from './n8n';

// ========================================
// Combined Integration Functions
// ========================================

/**
 * Complete candidate registration with AI analysis
 * Saves to Supabase + triggers n8n analysis
 */
export const completeCandidateRegistration = async (candidateData: {
  userId: string;
  fullName: string;
  email: string;
  mentorData: any;
  professionalProfile: any;
  dreamJob: any;
  conversationData?: any;
}) => {
  try {
    // 1. Save to Supabase
    const candidateProfile = await createCandidateProfile({
      user_id: candidateData.userId,
      full_name: candidateData.fullName,
      selected_mentor: candidateData.mentorData,
      profile_completion_percentage: 85,
      is_profile_public: true,
      is_seeking_job: true,
      location_country: 'BR',
    });

    if (candidateProfile.error) {
      throw new Error(`Failed to create candidate profile: ${candidateProfile.error.message}`);
    }

    const candidateId = candidateProfile.data!.id;

    // 2. Save professional assessment
    const assessment = await saveProfessionalAssessment({
      candidate_id: candidateId,
      primary_profile: candidateData.professionalProfile.primaryProfile,
      secondary_profile: candidateData.professionalProfile.secondaryProfile,
      profile_type: candidateData.professionalProfile.profileType,
      leadership_score: candidateData.professionalProfile.scores?.leadership || 0,
      communication_score: candidateData.professionalProfile.scores?.communication || 0,
      analytical_score: candidateData.professionalProfile.scores?.analytical || 0,
      creative_score: candidateData.professionalProfile.scores?.creative || 0,
      execution_score: candidateData.professionalProfile.scores?.execution || 0,
      overall_score: candidateData.professionalProfile.assessmentScore || 0,
      percentile: candidateData.professionalProfile.percentile || 0,
      assessment_duration_minutes: 15,
      questions_answered: 20,
      detailed_results: candidateData.professionalProfile.detailedResults || {},
      strengths: candidateData.professionalProfile.strengths || [],
      development_areas: candidateData.professionalProfile.developmentAreas || [],
    });

    // 3. Save dream job
    const dreamJobResult = await saveDreamJob({
      candidate_id: candidateId,
      position: candidateData.dreamJob.position,
      seniority_level: 'senior',
      work_format: candidateData.dreamJob.workModel === 'Híbrido' ? 'hibrido' : 
                   candidateData.dreamJob.workModel === 'Remoto' ? 'remoto' : 'presencial',
      contract_type: 'clt',
      salary_min: candidateData.dreamJob.salaryRange?.min,
      salary_max: candidateData.dreamJob.salaryRange?.max,
      salary_currency: 'BRL',
      preferred_company_sizes: Array.isArray(candidateData.dreamJob.companySize) ? 
                              candidateData.dreamJob.companySize : [candidateData.dreamJob.companySize],
      preferred_industries: Array.isArray(candidateData.dreamJob.industry) ? 
                           candidateData.dreamJob.industry : [candidateData.dreamJob.industry],
      preferred_locations: [],
      open_to_relocation: false,
      notice_period_days: 30,
      matching_flags: {},
      is_active: true,
    });

    // 4. Trigger n8n analysis (async, don't wait)
    const n8nAnalysis = triggerCandidateAnalysis({
      candidateId,
      email: candidateData.email,
      fullName: candidateData.fullName,
      professionalProfile: {
        primaryProfile: candidateData.professionalProfile.primaryProfile,
        secondaryProfile: candidateData.professionalProfile.secondaryProfile,
        profileType: candidateData.professionalProfile.profileType,
        overallScore: candidateData.professionalProfile.assessmentScore || 0,
      },
      dreamJob: {
        position: candidateData.dreamJob.position,
        salaryRange: candidateData.dreamJob.salaryRange || { min: 5000, max: 10000 },
        industries: Array.isArray(candidateData.dreamJob.industry) ? 
                   candidateData.dreamJob.industry : [candidateData.dreamJob.industry],
        workFormat: candidateData.dreamJob.workModel || 'Híbrido',
      },
      mentorData: candidateData.mentorData,
    });

    // 5. If AI conversation data exists, process insights
    if (candidateData.conversationData) {
      processAIConversationInsights({
        candidateId,
        conversationData: candidateData.conversationData,
        extractedInsights: {
          skills: candidateData.conversationData.extractedSkills || [],
          interests: candidateData.conversationData.interests || [],
          careerGoals: candidateData.conversationData.careerGoals || [],
          personalityTraits: candidateData.conversationData.personalityTraits || [],
        },
      });
    }

    // 6. Send welcome email
    sendWelcomeEmail({
      email: candidateData.email,
      fullName: candidateData.fullName,
      mentorName: candidateData.mentorData.name,
      mentorAvatar: candidateData.mentorData.avatar,
    });

    console.log('✅ Candidate registration completed successfully');
    return {
      success: true,
      candidateId,
      data: {
        candidateProfile: candidateProfile.data,
        assessment: assessment.data,
        dreamJob: dreamJobResult.data,
      },
    };

  } catch (error) {
    console.error('❌ Error in candidate registration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Create job with automatic candidate matching
 * Saves job to Supabase + triggers n8n matching
 */
export const createJobWithMatching = async (jobData: {
  companyId: string;
  title: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  requirements: string[];
  benefits: string[];
  workFormat: 'presencial' | 'remoto' | 'hibrido';
  seniority: 'junior' | 'pleno' | 'senior' | 'especialista';
}) => {
  try {
    // 1. Create job in Supabase
    const jobResult = await createJob({
      company_id: jobData.companyId,
      title: jobData.title,
      description: jobData.description,
      seniority_level: jobData.seniority,
      work_format: jobData.workFormat,
      contract_type: 'clt',
      job_location_country: 'BR',
      salary_min: jobData.salaryMin,
      salary_max: jobData.salaryMax,
      salary_currency: 'BRL',
      salary_show_range: !!(jobData.salaryMin && jobData.salaryMax),
      requirements: jobData.requirements.map(req => ({ name: req })),
      benefits: jobData.benefits.map(benefit => ({ name: benefit })),
      matching_flags: {},
      target_profile_flags: {},
      status: 'active',
    });

    if (jobResult.error) {
      throw new Error(`Failed to create job: ${jobResult.error.message}`);
    }

    const jobId = jobResult.data!.id;

    // 2. Trigger n8n job matching (async)
    const matchingResult = await triggerJobMatching({
      jobId,
      companyId: jobData.companyId,
      jobTitle: jobData.title,
      candidateIds: [], // n8n will find matching candidates
      matchingCriteria: {
        salaryRange: { 
          min: jobData.salaryMin || 0, 
          max: jobData.salaryMax || 999999 
        },
        requiredSkills: jobData.requirements,
        workFormat: jobData.workFormat,
        seniority: jobData.seniority,
      },
    });

    console.log('✅ Job created and matching triggered');
    return {
      success: true,
      jobId,
      data: jobResult.data,
      matchingTriggered: matchingResult.success,
    };

  } catch (error) {
    console.error('❌ Error in job creation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Process match results from n8n and save to Supabase
 * Called by n8n webhook or polling
 */
export const processMatchResults = async (matchResults: Array<{
  candidateId: string;
  jobId: string;
  companyId: string;
  compatibilityScore: number;
  compatibilityBreakdown: any;
}>) => {
  const results = [];

  for (const match of matchResults) {
    try {
      const matchResult = await createMatch({
        candidate_id: match.candidateId,
        job_id: match.jobId,
        company_id: match.companyId,
        compatibility_score: match.compatibilityScore,
        compatibility_breakdown: match.compatibilityBreakdown,
        status: 'pending',
        conversation_started: false,
      });

      if (matchResult.error) {
        console.error(`Failed to create match: ${matchResult.error.message}`);
        results.push({ success: false, error: matchResult.error.message });
      } else {
        results.push({ success: true, matchId: matchResult.data!.id });
      }
    } catch (error) {
      console.error('Error processing match:', error);
      results.push({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  return results;
};

// ========================================
// Error Handling & Retry Logic
// ========================================

/**
 * Retry failed n8n operations
 */
export const retryFailedOperation = async (
  operation: () => Promise<any>,
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      if (result.success) {
        return result;
      }
      throw new Error(result.error || 'Operation failed');
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        return {
          success: false,
          error: `Failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// ========================================
// Health Check & Monitoring
// ========================================

/**
 * Check integration health (Supabase + n8n)
 */
export const checkIntegrationHealth = async () => {
  const results = {
    supabase: { status: 'unknown', latency: 0 },
    n8n: { status: 'unknown', latency: 0 },
    overall: 'unknown',
  };

  // Test Supabase
  const supabaseStart = Date.now();
  try {
    const { error } = await import('./supabase').then(m => m.supabase.from('user_profiles').select('id').limit(1));
    results.supabase = {
      status: error ? 'error' : 'ok',
      latency: Date.now() - supabaseStart,
    };
  } catch (error) {
    results.supabase = {
      status: 'error',
      latency: Date.now() - supabaseStart,
    };
  }

  // Test n8n
  const n8nStart = Date.now();
  try {
    const { testN8nConnection } = await import('./n8n');
    const n8nResult = await testN8nConnection();
    results.n8n = {
      status: n8nResult.success ? 'ok' : 'error',
      latency: Date.now() - n8nStart,
    };
  } catch (error) {
    results.n8n = {
      status: 'error',
      latency: Date.now() - n8nStart,
    };
  }

  // Overall status
  results.overall = results.supabase.status === 'ok' && results.n8n.status === 'ok' 
    ? 'ok' 
    : results.supabase.status === 'ok' || results.n8n.status === 'ok'
    ? 'partial'
    : 'error';

  return results;
};