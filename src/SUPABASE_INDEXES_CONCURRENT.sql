-- 🚀 RAVYZ Concurrent Indexes for Production
-- Run AFTER initial schema deployment to add concurrent indexes safely

-- ========================================
-- CONCURRENT INDEXES FOR PRODUCTION
-- Execute these OUTSIDE a transaction, one by one
-- ========================================

-- Core matching indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_compatibility_score_concurrent 
ON public.matches(compatibility_score DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_status_concurrent 
ON public.matches(status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_candidate_job_concurrent 
ON public.matches(candidate_id, job_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_created_at_concurrent 
ON public.matches(created_at DESC);

-- User profile indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_type_concurrent 
ON public.user_profiles(user_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_document_concurrent 
ON public.user_profiles(document);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_status_concurrent 
ON public.user_profiles(status);

-- Candidate search indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidate_profiles_location_concurrent 
ON public.candidate_profiles(location_city, location_state);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidate_profiles_seeking_concurrent 
ON public.candidate_profiles(is_seeking_job);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_professional_assessments_profile_concurrent 
ON public.professional_assessments(primary_profile, secondary_profile);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dream_jobs_position_seniority_concurrent 
ON public.dream_jobs(position, seniority_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dream_jobs_active_concurrent 
ON public.dream_jobs(is_active);

-- Job search indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_location_seniority_concurrent 
ON public.jobs(job_location_city, job_location_state, seniority_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status_created_concurrent 
ON public.jobs(status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_salary_range_concurrent 
ON public.jobs(salary_min, salary_max);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_concurrent 
ON public.jobs(company_id);

-- Skills indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidate_skills_candidate_concurrent 
ON public.candidate_skills(candidate_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidate_skills_proficiency_concurrent 
ON public.candidate_skills(proficiency_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_required_skills_job_concurrent 
ON public.job_required_skills(job_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_skills_category_concurrent 
ON public.skills(category);

-- Analytics indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_analytics_user_activity_concurrent 
ON public.user_analytics(user_id, last_activity_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_feedback_ratings_overall_concurrent 
ON public.feedback_ratings(overall_rating DESC, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matching_analytics_date_concurrent 
ON public.matching_analytics(date_snapshot DESC);

-- Message indexes (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_concurrent 
ON public.messages(conversation_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_match_concurrent 
ON public.conversations(match_id);

-- JSONB indexes for matching flags (CONCURRENT)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dream_jobs_matching_flags_concurrent 
ON public.dream_jobs USING GIN (matching_flags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_matching_flags_concurrent 
ON public.jobs USING GIN (matching_flags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_target_profile_flags_concurrent 
ON public.jobs USING GIN (target_profile_flags);

-- ========================================
-- DROP OLD NON-CONCURRENT INDEXES
-- After concurrent indexes are created successfully
-- ========================================

/*
-- Run these commands AFTER all concurrent indexes are successfully created
-- to remove the non-concurrent versions:

DROP INDEX IF EXISTS public.idx_matches_compatibility_score;
DROP INDEX IF EXISTS public.idx_matches_status;
DROP INDEX IF EXISTS public.idx_matches_candidate_job;
DROP INDEX IF EXISTS public.idx_matches_created_at;
DROP INDEX IF EXISTS public.idx_user_profiles_type;
DROP INDEX IF EXISTS public.idx_user_profiles_document;
DROP INDEX IF EXISTS public.idx_user_profiles_status;
DROP INDEX IF EXISTS public.idx_candidate_profiles_location;
DROP INDEX IF EXISTS public.idx_candidate_profiles_seeking;
DROP INDEX IF EXISTS public.idx_professional_assessments_profile;
DROP INDEX IF EXISTS public.idx_dream_jobs_position_seniority;
DROP INDEX IF EXISTS public.idx_dream_jobs_active;
DROP INDEX IF EXISTS public.idx_jobs_location_seniority;
DROP INDEX IF EXISTS public.idx_jobs_status_created;
DROP INDEX IF EXISTS public.idx_jobs_salary_range;
DROP INDEX IF EXISTS public.idx_jobs_company;
DROP INDEX IF EXISTS public.idx_candidate_skills_candidate;
DROP INDEX IF EXISTS public.idx_candidate_skills_proficiency;
DROP INDEX IF EXISTS public.idx_job_required_skills_job;
DROP INDEX IF EXISTS public.idx_skills_category;
DROP INDEX IF EXISTS public.idx_user_analytics_user_activity;
DROP INDEX IF EXISTS public.idx_feedback_ratings_overall;
DROP INDEX IF EXISTS public.idx_matching_analytics_date;
DROP INDEX IF EXISTS public.idx_messages_conversation;
DROP INDEX IF EXISTS public.idx_conversations_match;
DROP INDEX IF EXISTS public.idx_dream_jobs_matching_flags;
DROP INDEX IF EXISTS public.idx_jobs_matching_flags;
DROP INDEX IF EXISTS public.idx_jobs_target_profile_flags;

-- Then rename concurrent indexes to remove the "_concurrent" suffix:
ALTER INDEX public.idx_matches_compatibility_score_concurrent 
RENAME TO idx_matches_compatibility_score;

ALTER INDEX public.idx_matches_status_concurrent 
RENAME TO idx_matches_status;

-- Continue for all other indexes...
*/

-- ========================================
-- MONITORING QUERY
-- ========================================

-- Query to monitor index creation progress
SELECT 
  schemaname,
  tablename,
  indexname,
  CASE 
    WHEN indexname LIKE '%_concurrent' THEN '🔄 Concurrent'
    ELSE '✅ Regular'
  END as index_type,
  pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;